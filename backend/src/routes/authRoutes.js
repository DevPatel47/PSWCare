const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage("Name must be 2-80 characters"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("role")
      .isIn(["psw", "client"])
      .withMessage("Role must be psw or client"),
  ],
  validateRequest,
  authController.register,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty(),
  ],
  validateRequest,
  authController.login,
);

router.post(
  "/admin/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty(),
  ],
  validateRequest,
  authController.adminLogin,
);

router.post("/refresh", authController.refresh);
router.post("/logout", protect, authController.logout);
router.get("/me", protect, authController.me);

module.exports = router;
