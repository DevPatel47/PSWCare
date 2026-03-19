const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const PSWProfile = require("../models/PSWProfile");
const { APPOINTMENT_STATUS, PAYMENT_STATUS, ROLES } = require("../constants");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const {
  createPaymentIntent,
  retrievePaymentIntent,
} = require("../services/paymentService");

const createAppointmentPaymentIntent = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.CLIENT) {
    throw new AppError("Only clients can initiate payments", 403);
  }

  const appointment = await Appointment.findById(req.params.appointmentId);
  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  if (appointment.client.toString() !== req.user._id.toString()) {
    throw new AppError("Forbidden", 403);
  }

  if (appointment.status !== APPOINTMENT_STATUS.CONFIRMED) {
    throw new AppError(
      "Payment allowed only after appointment is confirmed",
      400,
    );
  }

  const profile = await PSWProfile.findOne({ user: appointment.psw });
  if (!profile) {
    throw new AppError("PSW profile not found", 404);
  }

  const durationHours =
    (appointment.scheduledEnd - appointment.scheduledStart) / (1000 * 60 * 60);
  const amountCents = Math.round(
    durationHours * Number(profile.hourlyRate) * 100,
  );

  const intent = await createPaymentIntent({
    amount: amountCents,
    currency: "cad",
    metadata: {
      appointmentId: appointment._id.toString(),
      clientId: req.user._id.toString(),
      pswId: appointment.psw.toString(),
    },
  });

  await Payment.findOneAndUpdate(
    { appointment: appointment._id },
    {
      appointment: appointment._id,
      client: appointment.client,
      psw: appointment.psw,
      amount: amountCents / 100,
      currency: "cad",
      stripePaymentIntentId: intent.id,
      status: PAYMENT_STATUS.PENDING,
    },
    { upsert: true, new: true },
  );

  return res.status(200).json({
    success: true,
    data: {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: amountCents / 100,
    },
  });
});

const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;
  if (!paymentIntentId) {
    throw new AppError("paymentIntentId is required", 400);
  }

  const intent = await retrievePaymentIntent(paymentIntentId);
  const payment = await Payment.findOne({
    stripePaymentIntentId: paymentIntentId,
  });
  if (!payment) {
    throw new AppError("Payment record not found", 404);
  }

  payment.status =
    intent.status === "succeeded"
      ? PAYMENT_STATUS.SUCCEEDED
      : PAYMENT_STATUS.FAILED;
  payment.receiptUrl = intent.charges?.data?.[0]?.receipt_url || "";
  await payment.save();

  return res.status(200).json({
    success: true,
    message: "Payment status synchronized",
    data: { payment },
  });
});

module.exports = {
  createAppointmentPaymentIntent,
  confirmPayment,
};
