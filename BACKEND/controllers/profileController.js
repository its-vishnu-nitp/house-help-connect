/**
 * ============================================================================
 * FILE: profileController.js
 * PURPOSE: Handles fetching, updating, and searching user profiles.
 * MODELS USED: HelperProfile, EmployerProfile, User
 * ============================================================================
 */

import User from "../models/User.js";
import HelperProfile from "../models/HelperProfile.js";
import EmployerProfile from "../models/EmployerProfile.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Retrieves the profile data for the currently logged-in user.
 * Fetches the base User document and attaches the role-specific profile.
 * Maps 'phoneNumber' -> 'phone' so the frontend state always populates correctly.
 */
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id || req.user._id;
  //console.log(`🟡 [PROFILE] Fetch profile hit! User ID: ${userId}, Role: ${req.user.role}`);

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      //console.log("🔴 [PROFILE] Fetch FAILED: User not found in database.");
      return next(new AppError("User not found", 404));
    }

    let roleProfile = null;
    if (user.role === "worker") {
      roleProfile = await HelperProfile.findOne({ userId });
      if (!roleProfile) {
        roleProfile = await HelperProfile.create({
          userId,
          services: ["Deep Cleaning"],
          serviceCategory: "Deep Cleaning",
          hourlyRate: 250,
          experience: 1,
          isAvailable: true
        });
      }
    } else if (user.role === "client") {
      roleProfile = await EmployerProfile.findOne({ userId }).populate("savedProfessionals");
      if (!roleProfile) {
        roleProfile = await EmployerProfile.create({ userId });
      }
    }

    //console.log(`🟢 [PROFILE] Fetch SUCCESS! Profile loaded for ${user.email}`);
    
    // Convert to plain object and ensure phone is populated for frontend
    const userObj = user.toObject();
    userObj.phone = userObj.phoneNumber || userObj.phone || "";

    res.status(200).json({
      success: true,
      user: userObj,
      profile: roleProfile || {}
    });
  } catch (error) {
    console.error("🔴 [PROFILE] Fetch FAILED with server error:", error.message);
    return next(error);
  }
});

/**
 * Updates both core User and HelperProfile / EmployerProfile.
 * Sanitizes phone input to exactly 10 digits to prevent Mongoose validation failures.
 * Persists multiple services and reflects immediately on page reload.
 */
export const updateMyProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role;
  const { name, phone, phoneNumber, city, bio, hourlyRate, services, serviceCategory, experience } = req.body;

  //console.log(`🟡 [PROFILE] Update hit! User ID: ${userId}, Role: ${role}`);
  //console.log("🟡 [DEBUG] Update payload:", req.body);

  try {
    // 1. Sanitize & Validate Phone Number (10 digits)
    const rawPhone = phone || phoneNumber;
    let sanitizedPhone = undefined;

    if (rawPhone && String(rawPhone).trim() !== "") {
      const digitsOnly = String(rawPhone).replace(/\D/g, "");
      // Pick last 10 digits to gracefully handle +91 / country code prefixes
      sanitizedPhone = digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;

      if (sanitizedPhone.length !== 10) {
        return next(new AppError("Please provide a valid 10-digit phone number", 400));
      }
    }

    // 2. Build User Update Query
    const userUpdateFields = {};
    if (name && name.trim() !== "") userUpdateFields.name = name.trim();
    if (sanitizedPhone) userUpdateFields.phoneNumber = sanitizedPhone; // Matches User.js schema
    if (city && city.trim() !== "") userUpdateFields["location.city"] = city.trim();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: userUpdateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    // 3. Update Role Profile (Worker vs Client)
    let updatedProfile = null;

    if (role === "worker") {
      // Normalize services array
      let resolvedServices = [];
      if (Array.isArray(services) && services.length > 0) {
        resolvedServices = services;
      } else if (serviceCategory) {
        resolvedServices = [serviceCategory];
      }

      const helperFields = {};
      if (bio !== undefined) helperFields.bio = bio;
      if (hourlyRate !== undefined && hourlyRate !== "") helperFields.hourlyRate = Number(hourlyRate);
      if (experience !== undefined && experience !== "") helperFields.experience = Number(experience);
      if (resolvedServices.length > 0) {
        helperFields.services = resolvedServices;
        helperFields.serviceCategory = resolvedServices[0]; // Backward-compatibility
      }

      updatedProfile = await HelperProfile.findOneAndUpdate(
        { userId },
        { $set: helperFields },
        { new: true, upsert: true, runValidators: true }
      );
    } else if (role === "client") {
      updatedProfile = await EmployerProfile.findOneAndUpdate(
        { userId },
        { $set: { ...(bio !== undefined && { bio }) } },
        { new: true, upsert: true, runValidators: true }
      );
    }

    //console.log(`🟢 [PROFILE] Update SUCCESS! Saved changes for user: ${updatedUser.name}`);

    // Map phone back to user object for frontend consistency
    const userResponse = updatedUser.toObject();
    userResponse.phone = userResponse.phoneNumber || "";

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse,
      profile: updatedProfile
    });
  } catch (error) {
    console.error("🔴 [PROFILE] Update FAILED:", error.message);
    return next(error);
  }
});

/**
 * Searches the database for available workers based on category and city.
 * Checks both the multiple 'services' array and single 'serviceCategory'.
 */
export const searchWorkers = asyncHandler(async (req, res, next) => {
  const { category, city, page = 1, limit = 6 } = req.query;
  const currentPage = Math.max(1, parseInt(page, 10));
  const currentLimit = Math.max(1, parseInt(limit, 10));
  const skip = (currentPage - 1) * currentLimit;

  //console.log(`🟡 [PROFILE] Search workers hit! Category: "${category || 'Any'}", City: "${city || 'Any'}"`);

  try {
    let userQuery = { role: "worker", isActive: true };
    if (city && city.trim() !== "") {
      userQuery["location.city"] = new RegExp(city.trim(), "i");
    }

    const matchingUsers = await User.find(userQuery).select("_id");
    const userIds = matchingUsers.map((user) => user._id);

    let profileQuery = { userId: { $in: userIds }, isAvailable: true };

    // Matches if category is inside the services array OR matches legacy serviceCategory
    if (category && category.trim() !== "") {
      const regex = new RegExp(category.trim(), "i");
      profileQuery.$or = [
        { services: { $elemMatch: { $regex: regex } } },
        { serviceCategory: regex }
      ];
    }

    const totalWorkers = await HelperProfile.countDocuments(profileQuery);

    const workers = await HelperProfile.find(profileQuery)
      .populate("userId", "name profilePicture bio phoneNumber phone location")
      .sort("-rating")
      .skip(skip)
      .limit(currentLimit);

    const hasMore = skip + workers.length < totalWorkers;

    res.status(200).json({
      success: true,
      count: workers.length,
      totalWorkers,
      currentPage,
      hasMore,
      workers
    });
  } catch (error) {
    console.error("🔴 [PROFILE] Search FAILED:", error.message);
    return next(error);
  }
});

/**
 * Get a specific worker's public profile by their User ID.
 */
export const getWorkerProfileById = asyncHandler(async (req, res, next) => {
  try {
    const workerProfile = await HelperProfile.findOne({ userId: req.params.id })
      .populate("userId", "name profilePicture bio location createdAt phone phoneNumber");

    if (!workerProfile) {
      return next(new AppError("Worker profile not found", 404));
    }

    res.status(200).json({
      success: true,
      profile: workerProfile
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Add or remove a worker from a client's "savedProfessionals" list.
 */
export const toggleSaveProfessional = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "client") {
    return next(new AppError("Only clients can save professionals", 403));
  }

  const { workerProfileId } = req.body;
  if (!workerProfileId) {
    return next(new AppError("Worker profile ID is required", 400));
  }

  try {
    const clientProfile = await EmployerProfile.findOne({ userId: req.user.id });
    if (!clientProfile) {
      return next(new AppError("Client profile not found", 404));
    }

    const isSaved = clientProfile.savedProfessionals.includes(workerProfileId);

    if (isSaved) {
      clientProfile.savedProfessionals = clientProfile.savedProfessionals.filter(
        (id) => id.toString() !== workerProfileId.toString()
      );
    } else {
      clientProfile.savedProfessionals.push(workerProfileId);
    }

    await clientProfile.save();

    res.status(200).json({
      success: true,
      message: isSaved ? "Professional removed from saved list" : "Professional saved successfully",
      savedProfessionals: clientProfile.savedProfessionals
    });
  } catch (error) {
    return next(error);
  }
});