const Appointment = require("../models/Appointment");
const PSWProfile = require("../models/PSWProfile");
const Payment = require("../models/Payment");
const Dispute = require("../models/Dispute");
const {
  APPOINTMENT_STATUS,
  PSW_APPROVAL_STATUS,
  ROLES,
} = require("../constants");
const asyncHandler = require("../utils/asyncHandler");

const generateDashboard = asyncHandler(async (req, res) => {
  const role = req.user.role;

  if (role === ROLES.CLIENT) {
    const [pending, confirmed, completed, payments] = await Promise.all([
      Appointment.countDocuments({
        client: req.user._id,
        status: APPOINTMENT_STATUS.PENDING,
      }),
      Appointment.countDocuments({
        client: req.user._id,
        status: APPOINTMENT_STATUS.CONFIRMED,
      }),
      Appointment.countDocuments({
        client: req.user._id,
        status: APPOINTMENT_STATUS.COMPLETED,
      }),
      Payment.countDocuments({ client: req.user._id }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        role,
        stats: { pending, confirmed, completed, payments },
        actions: [
          "book-appointment",
          "pay-confirmed-appointment",
          "chat-confirmed-appointment",
        ],
      },
    });
  }

  if (role === ROLES.PSW) {
    const [pending, confirmed, completed, profile] = await Promise.all([
      Appointment.countDocuments({
        psw: req.user._id,
        status: APPOINTMENT_STATUS.PENDING,
      }),
      Appointment.countDocuments({
        psw: req.user._id,
        status: APPOINTMENT_STATUS.CONFIRMED,
      }),
      Appointment.countDocuments({
        psw: req.user._id,
        status: APPOINTMENT_STATUS.COMPLETED,
      }),
      PSWProfile.findOne({ user: req.user._id }).select(
        "approvalStatus certifications",
      ),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        role,
        stats: {
          pending,
          confirmed,
          completed,
          approvalStatus:
            profile?.approvalStatus || PSW_APPROVAL_STATUS.PENDING,
          certifications: profile?.certifications?.length || 0,
        },
        actions: [
          "update-profile",
          "upload-certification",
          "chat-confirmed-appointment",
        ],
      },
    });
  }

  const [
    pendingApprovals,
    activeAppointments,
    totalPayments,
    openDisputes,
    totalDisputes,
  ] = await Promise.all([
    PSWProfile.countDocuments({
      approvalStatus: PSW_APPROVAL_STATUS.PENDING,
    }),
    Appointment.countDocuments({ status: APPOINTMENT_STATUS.CONFIRMED }),
    Payment.countDocuments({}),
    Dispute.countDocuments({ status: "open" }),
    Dispute.countDocuments({}),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      role,
      stats: {
        pendingApprovals,
        activeAppointments,
        totalPayments,
        openDisputes,
        totalDisputes,
      },
      actions: ["approve-psw", "reject-psw", "monitor-transactions"],
    },
  });
});

module.exports = {
  generateDashboard,
};
