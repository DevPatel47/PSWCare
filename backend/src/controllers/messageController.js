const Appointment = require("../models/Appointment");
const Message = require("../models/Message");
const { APPOINTMENT_STATUS } = require("../constants");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const assertChatAllowed = async ({ appointmentId, userId }) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  const isParticipant =
    appointment.client.toString() === userId.toString() ||
    appointment.psw.toString() === userId.toString();
  if (!isParticipant) {
    throw new AppError("Forbidden", 403);
  }

  if (appointment.status !== APPOINTMENT_STATUS.CONFIRMED) {
    throw new AppError("Chat is enabled only for confirmed appointments", 400);
  }

  return appointment;
};

const listMessagesByAppointment = asyncHandler(async (req, res) => {
  await assertChatAllowed({
    appointmentId: req.params.appointmentId,
    userId: req.user._id,
  });

  const messages = await Message.find({ appointment: req.params.appointmentId })
    .populate("sender", "name role")
    .sort({ createdAt: 1 });

  return res.status(200).json({
    success: true,
    data: { messages },
  });
});

const createMessage = asyncHandler(async (req, res) => {
  await assertChatAllowed({
    appointmentId: req.params.appointmentId,
    userId: req.user._id,
  });

  const message = await Message.create({
    appointment: req.params.appointmentId,
    sender: req.user._id,
    content: req.body.content,
  });

  return res.status(201).json({
    success: true,
    message: "Message sent",
    data: { message },
  });
});

module.exports = {
  listMessagesByAppointment,
  createMessage,
};
