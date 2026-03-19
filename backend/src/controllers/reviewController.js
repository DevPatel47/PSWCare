const Appointment = require("../models/Appointment");
const Review = require("../models/Review");
const { APPOINTMENT_STATUS, ROLES } = require("../constants");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const createReview = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.CLIENT) {
    throw new AppError("Only clients can submit reviews", 403);
  }

  const { appointmentId, rating, comment = "" } = req.body;
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  if (appointment.client.toString() !== req.user._id.toString()) {
    throw new AppError("You can only review your own appointment", 403);
  }

  if (appointment.status !== APPOINTMENT_STATUS.COMPLETED) {
    throw new AppError(
      "Reviews are allowed only after completed appointments",
      400,
    );
  }

  const existingReview = await Review.findOne({
    appointment: appointmentId,
    client: req.user._id,
  });
  if (existingReview) {
    throw new AppError("Duplicate review is not allowed", 409);
  }

  const review = await Review.create({
    appointment: appointment._id,
    client: req.user._id,
    psw: appointment.psw,
    rating,
    comment,
  });

  return res.status(201).json({
    success: true,
    message: "Review submitted",
    data: { review },
  });
});

const listPSWReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ psw: req.params.pswId })
    .populate("client", "name")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: { reviews },
  });
});

module.exports = {
  createReview,
  listPSWReviews,
};
