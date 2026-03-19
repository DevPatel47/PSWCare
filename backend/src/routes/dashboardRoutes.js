const express = require("express");

const dashboardController = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/generate", protect, dashboardController.generateDashboard);

module.exports = router;
