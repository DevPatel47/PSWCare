const express = require("express");
const { body, param } = require("express-validator");

const messageController = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.use(protect);

router.get(
  "/appointment/:appointmentId",
  [
    param("appointmentId")
      .isMongoId()
      .withMessage("Valid appointmentId is required"),
  ],
  validateRequest,
  messageController.listMessagesByAppointment,
);

router.post(
  "/appointment/:appointmentId",
  [
    param("appointmentId")
      .isMongoId()
      .withMessage("Valid appointmentId is required"),
    body("content")
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Message must be 1-1000 chars"),
  ],
  validateRequest,
  messageController.createMessage,
);

module.exports = router;
