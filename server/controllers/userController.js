const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const fs = require("fs/promises");

// GET logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

// UPDATE logged-in user's profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, dateOfBirth, gender, address } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (dateOfBirth !== undefined) {
      user.dateOfBirth = dateOfBirth || null;
    }

    if (gender !== undefined) {
      user.gender = gender;
    }

    if (address !== undefined) {
      user.address = address;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Upload temporary file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "doctorcare/profile-images",
      resource_type: "image",
    });

    // Delete temporary file from server
    await fs.unlink(req.file.path).catch(() => {});

    // Save Cloudinary URL in MongoDB
    user.profileImage = result.secure_url;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Upload profile image error:", error);

    // Delete temporary file if it still exists
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    res.status(500).json({
      success: false,
      message: "Server error while uploading profile picture",
    });
  }
};

   
module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
};