const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
} = require("../controllers/appointmentController");

const protect = require("../middleware/authMiddleware");
const uploadReport = require("../middleware/reportUploadMiddleware");

const router = express.Router();

// Book appointment
router.post(
  "/",
  protect,
  uploadReport.single("report"),
  createAppointment
);

// Get logged-in patient's appointments
router.get(
  "/",
  protect,
  getMyAppointments
);

// Cancel appointment
router.put("/:id/cancel", protect, cancelAppointment);

module.exports = router;