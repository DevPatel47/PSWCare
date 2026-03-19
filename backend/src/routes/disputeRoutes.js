const express = require("express");
const { body, param } = require("express-validator");

const disputeController = require("../controllers/disputeController");
const { protect } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  [
    body("subject").trim().isLength({ min: 3, max: 140 }),
    body("description").trim().isLength({ min: 5, max: 2000 }),
    body("appointmentId").optional().isMongoId(),
    body("againstUserId").optional().isMongoId(),
  ],
  validateRequest,
  disputeController.createDispute,
);

router.get("/mine", disputeController.listMyDisputes);

router.get(
  "/:disputeId",
  [param("disputeId").isMongoId().withMessage("Valid disputeId is required")],
  validateRequest,
  disputeController.getDisputeDetail,
);

module.exports = router;
