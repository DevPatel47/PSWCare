const express = require("express");
const { body, param } = require("express-validator");

const reviewController = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get(
  "/psw/:pswId",
  [param("pswId").isMongoId().withMessage("Valid pswId is required")],
  validateRequest,
  reviewController.listPSWReviews,
);

router.post(
  "/",
  protect,
  [
    body("appointmentId")
      .isMongoId()
      .withMessage("Valid appointmentId is required"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("rating must be between 1 and 5"),
    body("comment")
      .optional()
      .isLength({ max: 600 })
      .withMessage("comment must be <= 600 chars"),
  ],
  validateRequest,
  reviewController.createReview,
);

module.exports = router;
