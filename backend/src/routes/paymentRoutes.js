const express = require("express");
const { body, param } = require("express-validator");

const paymentController = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.use(protect);

router.post(
  "/appointments/:appointmentId/intent",
  [
    param("appointmentId")
      .isMongoId()
      .withMessage("Valid appointmentId is required"),
  ],
  validateRequest,
  paymentController.createAppointmentPaymentIntent,
);

router.post(
  "/confirm",
  [
    body("paymentIntentId")
      .notEmpty()
      .withMessage("paymentIntentId is required"),
  ],
  validateRequest,
  paymentController.confirmPayment,
);

module.exports = router;
