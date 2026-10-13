const express = require("express");

const {
  getProfile,
  updateProfile,
  uploadProfileImage,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadmiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.post(
  "/profile/image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);

module.exports = router;