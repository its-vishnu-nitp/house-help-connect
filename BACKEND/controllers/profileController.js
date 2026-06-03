// --- controllers/profileController.js ---
import User from "../models/User.js";
import HelperProfile from "../models/HelperProfile.js";
import EmployerProfile from "../models/EmployerProfile.js";

// @desc    Get current user profile (including linked role-specific profile)
// @route   GET /api/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    let roleProfile = null;
    if (user.role === "worker") {
      roleProfile = await HelperProfile.findOne({ userId: user._id });
    } else if (user.role === "client") {
      roleProfile = await EmployerProfile.findOne({ userId: user._id })
        .populate("savedProfessionals");
    }

    res.status(200).json({
      success: true,
      user,
      profile: roleProfile || {}
    });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// @desc    Create or update role-specific profile
// @route   POST /api/profile/update
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { role } = req.user;
    const profileData = req.body;
    let updatedProfile;

    if (role === "worker") {
      updatedProfile = await HelperProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: profileData },
        { new: true, upsert: true, runValidators: true } // upsert creates it if it doesn't exist
      );
    } else if (role === "client") {
      updatedProfile = await EmployerProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: profileData },
        { new: true, upsert: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};