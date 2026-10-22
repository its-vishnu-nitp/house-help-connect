/**
 * profileController.js — fetching, updating, and searching user profiles.
 * Models used: HelperProfile, EmployerProfile, User
 */

import User from "../models/User.js";
import HelperProfile from "../models/HelperProfile.js";
import EmployerProfile from "../models/EmployerProfile.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

/** Shapes a User document for API responses: plain object with `phone` mapped from `phoneNumber`. */
const toUserResponse = (user) => {
  const userObj = user.toObject();
  userObj.phone = userObj.phoneNumber || userObj.phone || "";
  return userObj;
};

/**
 * Retrieves the profile data for the currently logged-in user.
 * Fetches the base User document and attaches the role-specific profile,
 * creating a default one on first access.
 */
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id || req.user._id;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  let roleProfile = null;
  if (user.role === "worker") {
    roleProfile =
      (await HelperProfile.findOne({ userId })) ||
      (await HelperProfile.create({
        userId,
        services: ["Deep Cleaning"],
        serviceCategory: "Deep Cleaning",
        hourlyRate: 250,
        experience: 1,
        isAvailable: true,
      }));
  } else if (user.role === "client") {
    roleProfile =
      (await EmployerProfile.findOne({ userId }).populate("savedProfessionals")) ||
      (await EmployerProfile.create({ userId }));
  }

  res.status(200).json({
    success: true,
    user: toUserResponse(user),
    profile: roleProfile || {},
  });
});

/**
 * Updates both core User and HelperProfile / EmployerProfile.
 * Sanitizes phone input to exactly 10 digits to prevent Mongoose validation failures.
 */
export const updateMyProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role;
  const { name, phone, phoneNumber, city, bio, hourlyRate, services, serviceCategory, experience } = req.body;

  // 1. Sanitize & validate phone number (10 digits)
  const rawPhone = phone || phoneNumber;
  let sanitizedPhone;

  if (rawPhone && String(rawPhone).trim() !== "") {
    const digitsOnly = String(rawPhone).replace(/\D/g, "");
    // Pick last 10 digits to gracefully handle +91 / country code prefixes
    sanitizedPhone = digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;

    if (sanitizedPhone.length !== 10) {
      return next(new AppError("Please provide a valid 10-digit phone number", 400));
    }
  }

  // 2. Build User update query
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

  // 3. Update role profile (worker vs client)
  let updatedProfile = null;

  if (role === "worker") {
    // Normalize services array
    const resolvedServices =
      Array.isArray(services) && services.length > 0 ? services : serviceCategory ? [serviceCategory] : [];

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

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: toUserResponse(updatedUser),
    profile: updatedProfile,
  });
});

/**
 * Searches the database for available workers based on category and city.
 * Checks both the multiple 'services' array and single 'serviceCategory'.
 */
export const searchWorkers = asyncHandler(async (req, res) => {
  const { category, city, page = 1, limit = 6 } = req.query;
  const currentPage = Math.max(1, parseInt(page, 10));
  const currentLimit = Math.max(1, parseInt(limit, 10));
  const skip = (currentPage - 1) * currentLimit;

  // Only Aadhaar-verified workers are visible in public search — the
  // verification flag is the platform's trust gate, not just a badge.
  const userQuery = { role: "worker", isActive: true, isAadhaarVerified: true };
  if (city && city.trim() !== "") {
    userQuery["location.city"] = new RegExp(city.trim(), "i");
  }

  const matchingUsers = await User.find(userQuery).select("_id");
  const userIds = matchingUsers.map((user) => user._id);

  const profileQuery = { userId: { $in: userIds }, isAvailable: true };

  // Matches if category is inside the services array OR matches legacy serviceCategory
  if (category && category.trim() !== "") {
    const regex = new RegExp(category.trim(), "i");
    profileQuery.$or = [{ services: { $elemMatch: { $regex: regex } } }, { serviceCategory: regex }];
  }

  const totalWorkers = await HelperProfile.countDocuments(profileQuery);

  const workers = await HelperProfile.find(profileQuery)
    // PUBLIC route: never expose phoneNumber / email / aadhaarNumber here.
    .populate("userId", "name profilePicture location.city")
    .sort("-rating")
    .skip(skip)
    .limit(currentLimit);

  res.status(200).json({
    success: true,
    count: workers.length,
    totalWorkers,
    currentPage,
    hasMore: skip + workers.length < totalWorkers,
    workers,
  });
});

/** Get a specific worker's public profile by their User ID. */
export const getWorkerProfileById = asyncHandler(async (req, res, next) => {
  const workerProfile = await HelperProfile.findOne({ userId: req.params.id }).populate(
    "userId",
    // PUBLIC route: public-safe fields only (no phone / email / aadhaar).
    "name profilePicture location createdAt"
  );

  if (!workerProfile) {
    return next(new AppError("Worker profile not found", 404));
  }

  res.status(200).json({ success: true, profile: workerProfile });
});

/**
 * Demo e-KYC: records the user's Aadhaar number and marks the account
 * verified. NOTE: this does NOT call the UIDAI API — it persists the number
 * and flag so the booking gate (requireAadhaar) and the UI have a real,
 * durable verification state instead of a fake client-side one.
 */
export const verifyAadhaar = asyncHandler(async (req, res, next) => {
  const userId = req.user.id || req.user._id;
  const digits = String(req.body.aadhaarNumber || "").replace(/\D/g, "");

  if (!/^\d{12}$/.test(digits)) {
    return next(new AppError("Please enter a valid 12-digit Aadhaar number", 400));
  }

  // aadhaarNumber is unique+sparse on the User schema — don't let one
  // number verify two accounts.
  const clash = await User.findOne({ aadhaarNumber: digits, _id: { $ne: userId } });
  if (clash) {
    return next(new AppError("This Aadhaar number is already linked to another account", 409));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { aadhaarNumber: digits, isAadhaarVerified: true } },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Aadhaar verification recorded successfully",
    user: toUserResponse(user),
  });
});

/**
 * Toggles a worker's availability. Search only returns workers whose
 * HelperProfile.isAvailable is true, so this is how a professional
 * pauses / resumes taking new bookings.
 */
export const updateAvailability = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "worker") {
    return next(new AppError("Only professionals can change availability", 403));
  }

  const { isAvailable } = req.body;
  if (typeof isAvailable !== "boolean") {
    return next(new AppError("isAvailable must be true or false", 400));
  }

  const profile = await HelperProfile.findOneAndUpdate(
    { userId: req.user.id },
    { $set: { isAvailable } },
    { new: true }
  );

  if (!profile) {
    return next(new AppError("Professional profile not found", 404));
  }

  res.status(200).json({ success: true, isAvailable: profile.isAvailable });
});

/** Add or remove a worker from a client's "savedProfessionals" list. */
export const toggleSaveProfessional = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "client") {
    return next(new AppError("Only clients can save professionals", 403));
  }

  const { workerProfileId } = req.body;
  if (!workerProfileId) {
    return next(new AppError("Worker profile ID is required", 400));
  }

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
    savedProfessionals: clientProfile.savedProfessionals,
  });
});
