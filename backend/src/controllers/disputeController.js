const Dispute = require("../models/Dispute");
const Appointment = require("../models/Appointment");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { createNotification } = require("../services/notificationService");

const createDispute = asyncHandler(async (req, res) => {
  const { appointmentId, againstUserId, subject, description } = req.body;

  if (appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    const isParticipant =
      appointment.client.toString() === req.user._id.toString() ||
      appointment.psw.toString() === req.user._id.toString();

    if (!isParticipant) {
      throw new AppError(
        "You can create disputes only for your appointments",
        403,
      );
    }
  }

  const dispute = await Dispute.create({
    appointment: appointmentId || null,
    createdBy: req.user._id,
    againstUser: againstUserId || null,
    subject,
    description,
    status: "open",
  });

  return res.status(201).json({
    success: true,
    message: "Dispute created",
    data: { dispute },
  });
});

const listMyDisputes = asyncHandler(async (req, res) => {
  const disputes = await Dispute.find({ createdBy: req.user._id })
    .populate("againstUser", "name email role")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: { disputes },
  });
});

const getDisputeDetail = asyncHandler(async (req, res) => {
  const dispute = await Dispute.findById(req.params.disputeId)
    .populate("createdBy", "name email role")
    .populate("againstUser", "name email role")
    .populate("resolvedBy", "name email role");

  if (!dispute) {
    throw new AppError("Dispute not found", 404);
  }

  const isOwner = dispute.createdBy._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new AppError("Forbidden", 403);
  }

  return res.status(200).json({
    success: true,
    data: { dispute },
  });
});

const notifyDisputeResolution = async ({ dispute }) => {
  await createNotification({
    userId: dispute.createdBy,
    type: "dispute",
    title: "Dispute case updated",
    message: `Your dispute \"${dispute.subject}\" is now ${dispute.status}.`,
    metadata: { disputeId: dispute._id },
  });
};

module.exports = {
  createDispute,
  listMyDisputes,
  getDisputeDetail,
  notifyDisputeResolution,
};
