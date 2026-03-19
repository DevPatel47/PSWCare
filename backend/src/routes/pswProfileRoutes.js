const express = require("express");
const multer = require("multer");
const { body, query } = require("express-validator");

const pswProfileController = require("../controllers/pswProfileController");
const { ROLES } = require("../constants");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get(
  "/search",
  [
    query("minRate").optional().isFloat({ min: 0 }),
    query("maxRate").optional().isFloat({ min: 0 }),
    query("experience").optional().isInt({ min: 0 }),
  ],
  validateRequest,
  pswProfileController.listApprovedPSWs,
);
router.get(
  "/admin/pending",
  protect,
  allowRoles(ROLES.ADMIN),
  pswProfileController.listPendingProfiles,
);
router.get(
  "/me",
  protect,
  allowRoles(ROLES.PSW),
  pswProfileController.getMyProfile,
);
router.get("/:userId", pswProfileController.getPSWProfileByUserId);

router.post(
  "/me",
  protect,
  allowRoles(ROLES.PSW),
  [
    body("hourlyRate")
      .isFloat({ gt: 0 })
      .withMessage("hourlyRate must be greater than 0"),
    body("skills").optional().isArray().withMessage("skills must be an array"),
    body("experienceYears")
      .optional()
      .isInt({ min: 0, max: 60 })
      .withMessage("experienceYears must be between 0 and 60"),
    body("availability")
      .optional()
      .isArray()
      .withMessage("availability must be an array"),
  ],
  validateRequest,
  pswProfileController.createOrUpdateMyProfile,
);

router.post(
  "/me/certifications",
  protect,
  allowRoles(ROLES.PSW),
  upload.single("file"),
  pswProfileController.uploadMyCertification,
);

router.patch(
  "/:profileId/approval",
  protect,
  allowRoles(ROLES.ADMIN),
  [
    body("status")
      .isIn(["pending", "approved", "rejected"])
      .withMessage("Invalid approval status"),
  ],
  validateRequest,
  pswProfileController.updateApprovalStatus,
);

module.exports = router;
