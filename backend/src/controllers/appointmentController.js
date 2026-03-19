const Appointment = require("../models/Appointment");
const PSWProfile = require("../models/PSWProfile");
const User = require("../models/User");
const {
  APPOINTMENT_STATUS,
  PSW_APPROVAL_STATUS,
  ROLES,
} = require("../constants");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const allowedTransitions = {
  [APPOINTMENT_STATUS.PENDING]: [
    APPOINTMENT_STATUS.CONFIRMED,
    APPOINTMENT_STATUS.CANCELLED,
  ],
  [APPOINTMENT_STATUS.CONFIRMED]: [
    APPOINTMENT_STATUS.COMPLETED,
    APPOINTMENT_STATUS.CANCELLED,
  ],
  [APPOINTMENT_STATUS.COMPLETED]: [],
  [APPOINTMENT_STATUS.CANCELLED]: [],
};

const createAppointment = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.CLIENT) {
    throw new AppError("Only clients can book appointments", 403);
  }

  const { pswId, scheduledStart, scheduledEnd, notes = "" } = req.body;
  const startDate = new Date(scheduledStart);
  const endDate = new Date(scheduledEnd);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new AppError("Invalid appointment start or end datetime", 400);
  }

  if (endDate <= startDate) {
    throw new AppError("Appointment end must be after start", 400);
  }

  const psw = await User.findById(pswId);
  if (!psw || psw.role !== ROLES.PSW) {
    throw new AppError("Invalid PSW", 400);
  }

  const profile = await PSWProfile.findOne({ user: pswId });
  if (!profile || profile.approvalStatus !== PSW_APPROVAL_STATUS.APPROVED) {
    throw new AppError("PSW is not approved for booking", 400);
  }

  const appointment = await Appointment.create({
    client: req.user._id,
    psw: pswId,
    scheduledStart: startDate,
    scheduledEnd: endDate,
    date: startDate.toISOString().slice(0, 10),
    time: startDate.toTimeString().slice(0, 5),
    notes,
    status: APPOINTMENT_STATUS.PENDING,
  });

  return res.status(201).json({
    success: true,
    message: "Appointment created",
    data: { appointment },
  });
});

const listMyAppointments = asyncHandler(async (req, res) => {
  const query =
    req.user.role === ROLES.PSW
      ? { psw: req.user._id }
      : { client: req.user._id };

  const appointments = await Appointment.find(query)
    .populate("client", "name email")
    .populate("psw", "name email")
    .sort({ scheduledStart: -1 });

  return res.status(200).json({
    success: true,
    data: { appointments },
  });
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, cancellationReason = "" } = req.body;
  if (!Object.values(APPOINTMENT_STATUS).includes(status)) {
    throw new AppError("Invalid appointment status", 400);
  }

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  const isAdmin = req.user.role === ROLES.ADMIN;
  const isParticipant =
    appointment.client.toString() === req.user._id.toString() ||
    appointment.psw.toString() === req.user._id.toString();

  if (!isAdmin && !isParticipant) {
    throw new AppError("Forbidden", 403);
  }

  const currentAllowed = allowedTransitions[appointment.status] || [];
  if (!currentAllowed.includes(status)) {
    throw new AppError(
      `Cannot transition from ${appointment.status} to ${status}`,
      400,
    );
  }

  appointment.status = status;
  appointment.cancellationReason =
    status === APPOINTMENT_STATUS.CANCELLED ? cancellationReason : "";
  await appointment.save();

  return res.status(200).json({
    success: true,
    message: "Appointment status updated",
    data: { appointment },
  });
});

const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { scheduledStart, scheduledEnd } = req.body;
  const startDate = new Date(scheduledStart);
  const endDate = new Date(scheduledEnd);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new AppError("Invalid appointment start or end datetime", 400);
  }

  if (endDate <= startDate) {
    throw new AppError("Appointment end must be after start", 400);
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  const isParticipant =
    appointment.client.toString() === req.user._id.toString() ||
    appointment.psw.toString() === req.user._id.toString();
  if (!isParticipant && req.user.role !== ROLES.ADMIN) {
    throw new AppError("Forbidden", 403);
  }

  if (
    ![APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED].includes(
      appointment.status,
    )
  ) {
    throw new AppError(
      "Only pending or confirmed appointments can be rescheduled",
      400,
    );
  }

  appointment.rescheduleHistory.push({
    previousStart: appointment.scheduledStart,
    previousEnd: appointment.scheduledEnd,
    newStart: startDate,
    newEnd: endDate,
    changedBy: req.user._id,
  });

  appointment.scheduledStart = startDate;
  appointment.scheduledEnd = endDate;
  appointment.date = startDate.toISOString().slice(0, 10);
  appointment.time = startDate.toTimeString().slice(0, 5);
  await appointment.save();

  return res.status(200).json({
    success: true,
    message: "Appointment rescheduled",
    data: { appointment },
  });
});

module.exports = {
  createAppointment,
  listMyAppointments,
  updateAppointmentStatus,
  rescheduleAppointment,
};
