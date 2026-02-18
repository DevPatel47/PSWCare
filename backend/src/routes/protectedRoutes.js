const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/client", protect, allowRoles("Client"), (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Client route accessed",
    data: { user: req.user },
  });
});

router.get("/psw", protect, allowRoles("PSW"), (req, res) => {
  return res.status(200).json({
    success: true,
    message: "PSW route accessed",
    data: { user: req.user },
  });
});

router.get("/admin", protect, allowRoles("Admin"), (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin route accessed",
    data: { user: req.user },
  });
});

module.exports = router;
