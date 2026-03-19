const User = require("../models/User");
const PSWProfile = require("../models/PSWProfile");
const Dispute = require("../models/Dispute");
const { ROLES, PSW_APPROVAL_STATUS } = require("../constants");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { createNotification } = require("../services/notificationService");

const deriveUserStatus = (user, pswProfile) => {
  if (!user.isActive) {
    return "banned";
  }

  if (
    user.role === ROLES.PSW &&
    pswProfile?.approvalStatus === PSW_APPROVAL_STATUS.PENDING
  ) {
    return "pending";
  }

  return "active";
};

const listUsers = asyncHandler(async (req, res) => {
  const { role, status, query } = req.query;

  const userFilter = {};
  if (role && Object.values(ROLES).includes(role)) {
    userFilter.role = role;
  }

  if (query) {
    userFilter.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  const users = await User.find(userFilter)
    .select("name email role isActive createdAt")
    .sort({ createdAt: -1 });

  const pswProfiles = await PSWProfile.find({
    user: {
      $in: users
        .filter((item) => item.role === ROLES.PSW)
        .map((item) => item._id),
    },
  }).select("user approvalStatus");

  const profileMap = new Map(
    pswProfiles.map((profile) => [String(profile.user), profile]),
  );

  const enriched = users.map((user) => {
    const pswProfile = profileMap.get(String(user._id));
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: deriveUserStatus(user, pswProfile),
      approvalStatus: pswProfile?.approvalStatus || null,
      createdAt: user.createdAt,
    };
  });

  const filteredByStatus = status
    ? enriched.filter((item) => item.status === status)
    : enriched;

  return res.status(200).json({
    success: true,
    data: {
      users: filteredByStatus,
    },
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["active", "banned"].includes(status)) {
    throw new AppError("Status must be active or banned", 400);
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.isActive = status === "active";
  await user.save();

  await createNotification({
    userId: user._id,
    type: "account",
    title: "Account status updated",
    message:
      status === "active"
        ? "Your account has been activated by admin."
        : "Your account has been temporarily suspended by admin.",
    metadata: { status },
  });

  return res.status(200).json({
    success: true,
    message: "User status updated",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status,
      },
    },
  });
});

const listDisputes = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (status) {
    query.status = status;
  }

  const disputes = await Dispute.find(query)
    .populate("createdBy", "name email role")
    .populate("againstUser", "name email role")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: { disputes },
  });
});

const resolveDispute = asyncHandler(async (req, res) => {
  const { status, resolutionNote = "" } = req.body;
  if (!["resolved", "rejected"].includes(status)) {
    throw new AppError("Status must be resolved or rejected", 400);
  }

  const dispute = await Dispute.findById(req.params.disputeId);
  if (!dispute) {
    throw new AppError("Dispute not found", 404);
  }

  dispute.status = status;
  dispute.resolutionNote = resolutionNote;
  dispute.resolvedBy = req.user._id;
  dispute.resolvedAt = new Date();
  await dispute.save();

  await createNotification({
    userId: dispute.createdBy,
    type: "dispute",
    title: "Dispute case updated",
    message: `Your dispute "${dispute.subject}" is now ${status}.`,
    metadata: {
      disputeId: dispute._id,
      status,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Dispute updated",
    data: { dispute },
  });
});

module.exports = {
  listUsers,
  updateUserStatus,
  listDisputes,
  resolveDispute,
};
