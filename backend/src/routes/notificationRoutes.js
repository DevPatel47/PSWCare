const express = require("express");
const { param } = require("express-validator");

const notificationController = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.use(protect);

router.get("/", notificationController.listMyNotifications);
router.patch(
  "/:notificationId/read",
  [
    param("notificationId")
      .isMongoId()
      .withMessage("Valid notificationId is required"),
  ],
  validateRequest,
  notificationController.markNotificationAsRead,
);
router.patch("/read-all", notificationController.markAllAsRead);
router.delete("/", notificationController.clearMyNotifications);

module.exports = router;
