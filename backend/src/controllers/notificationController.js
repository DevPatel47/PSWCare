const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const listMyNotifications = asyncHandler(async (req, res) => {
  const unreadOnly = String(req.query.unreadOnly || "false") === "true";
  const query = { user: req.user._id };

  if (unreadOnly) {
    query.readAt = null;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(100);

  return res.status(200).json({
    success: true,
    data: {
      notifications,
      unreadCount: notifications.filter((item) => !item.readAt).length,
    },
  });
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.notificationId,
    user: req.user._id,
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  if (!notification.readAt) {
    notification.readAt = new Date();
    await notification.save();
  }

  return res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: { notification },
  });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, readAt: null },
    { $set: { readAt: new Date() } },
  );

  return res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

const clearMyNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ user: req.user._id });

  return res.status(200).json({
    success: true,
    message: "Notifications cleared",
  });
});

module.exports = {
  listMyNotifications,
  markNotificationAsRead,
  markAllAsRead,
  clearMyNotifications,
};
