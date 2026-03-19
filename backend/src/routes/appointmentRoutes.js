const express = require("express");
const { body } = require("express-validator");

const appointmentController = require("../controllers/appointmentController");
const { protect } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  [
    body("pswId").isMongoId().withMessage("Valid pswId is required"),
    body("scheduledStart")
      .isISO8601()
      .withMessage("scheduledStart must be a valid date"),
    body("scheduledEnd")
      .isISO8601()
      .withMessage("scheduledEnd must be a valid date"),
  ],
  validateRequest,
  appointmentController.createAppointment,
);

router.get("/mine", appointmentController.listMyAppointments);

router.patch(
  "/:id/status",
  [body("status").isIn(["pending", "confirmed", "completed", "cancelled"])],
  validateRequest,
  appointmentController.updateAppointmentStatus,
);

router.patch(
  "/:id/reschedule",
  [
    body("scheduledStart")
      .isISO8601()
      .withMessage("scheduledStart must be a valid date"),
    body("scheduledEnd")
      .isISO8601()
      .withMessage("scheduledEnd must be a valid date"),
  ],
  validateRequest,
  appointmentController.rescheduleAppointment,
);

module.exports = router;
