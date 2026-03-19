const express = require("express");
const { body, param, query } = require("express-validator");

const adminController = require("../controllers/adminController");
const { ROLES } = require("../constants");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const { createNotification } = require("../services/notificationService");

const router = express.Router();

router.use(protect, allowRoles(ROLES.ADMIN));

router.get(
  "/users",
  [
    query("role").optional().isIn(["client", "psw", "admin"]),
    query("status").optional().isIn(["active", "pending", "banned"]),
  ],
  validateRequest,
  adminController.listUsers,
);

router.patch(
  "/users/:userId/status",
  [
    param("userId").isMongoId().withMessage("Valid userId is required"),
    body("status")
      .isIn(["active", "banned"])
      .withMessage("status must be active or banned"),
  ],
  validateRequest,
  adminController.updateUserStatus,
);

router.get(
  "/disputes",
  [query("status").optional().isIn(["open", "resolved", "rejected"])],
  validateRequest,
  adminController.listDisputes,
);

router.patch(
  "/disputes/:disputeId",
  [
    param("disputeId").isMongoId().withMessage("Valid disputeId is required"),
    body("status")
      .isIn(["resolved", "rejected"])
      .withMessage("status must be resolved or rejected"),
    body("resolutionNote").optional().isLength({ max: 1000 }),
  ],
  validateRequest,
  adminController.resolveDispute,
);

router.post(
  "/notifications",
  [
    body("userId").isMongoId().withMessage("Valid userId is required"),
    body("title").trim().isLength({ min: 1, max: 120 }),
    body("message").trim().isLength({ min: 1, max: 500 }),
  ],
  validateRequest,
  async (req, res) => {
    const notification = await createNotification({
      userId: req.body.userId,
      type: req.body.type || "admin",
      title: req.body.title,
      message: req.body.message,
      metadata: req.body.metadata || {},
    });

    return res.status(201).json({
      success: true,
      message: "Notification created",
      data: { notification },
    });
  },
);

module.exports = router;
