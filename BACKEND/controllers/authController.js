import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import EmployerProfile from "../models/EmployerProfile.js";
import HelperProfile from "../models/HelperProfile.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Helper function to generate a JWT, set it in an HTTP-only cookie, 
 * and return the success response to the client.
 */
const generateTokenAndRespond = (user, statusCode, res, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/", // Matches the clearCookie path
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  user.password = undefined;
  
  ////////console.log(`🔑 [AUTH] Token generated & cookie set for user ID: ${user._id}`);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
    },
  });
};

/**
 * Handles new user registration. 
 * Creates a base User document, hashes the password, and initializes 
 * either an EmployerProfile or HelperProfile depending on the role.
 */
export const register = asyncHandler(async (req, res, next) => {
  //////console.log(`🟡 [AUTH] Register endpoint hit! Attempting to register email: ${req.body.email} as ${req.body.role}`);
  
  let { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    //////console.log("🔴 [AUTH] Register FAILED: Missing required fields");
    return next(new AppError("Name, email, password, and role are required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    //////console.log("🔴 [AUTH] Register FAILED: Email already exists");
    return next(new AppError("Email already exists", 409));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userArray = await User.create([{
      name, 
      email, 
      password: hashedPassword, 
      role, 
    }], { session });

    const newUser = userArray[0];

    // Create the specific profile based on role
    if (role === "client") {
      await EmployerProfile.create([{ userId: newUser._id }], { session });
    } else if (role === "worker") {
      await HelperProfile.create([{ 
        userId: newUser._id,
        serviceCategory: "Deep Cleaning", // Default for MVP
        hourlyRate: 0,
      }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    //////console.log(`🟢 [AUTH] Register SUCCESS! User ${email} created successfully.`);
    generateTokenAndRespond(newUser, 201, res, "User registration successful");

  } catch (error) {
    console.error("🔴 [AUTH] Register TRANSACTION FAILED:", error.message);
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
});

/**
 * Authenticates a user. 
 * Verifies the email and password, then issues a JWT token for session management.
 */
export const login = asyncHandler(async (req, res, next) => {
  //////console.log(`🟡 [AUTH] Login endpoint hit! Attempting login for email: ${req.body.email}`);
  const { email, password } = req.body;

  if (!email || !password) {
    //////console.log("🔴 [AUTH] Login FAILED: Missing email or password");
    return next(new AppError("Email and password are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    //////console.log("🔴 [AUTH] Login FAILED: Invalid credentials");
    return next(new AppError("Invalid email or password", 401));
  }
  
  //////console.log(`🟢 [AUTH] Login SUCCESS! Token generated for: ${req.body.email}`);
  generateTokenAndRespond(user, 200, res, "Login successful");
});

/**
 * Logs out the user.
 * Clears the HTTP-only JWT cookie across the entire domain to terminate the active session.
 */
export const logout = (req, res) => {
  //////console.log("🟡 [AUTH] Logout endpoint hit!");

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/", // Ensures cookie clearance regardless of the requesting route
    expires: new Date(0), // Forces immediate expiration in the browser
  };

  res.clearCookie("token", cookieOptions);

  //////console.log("🟢 [AUTH] Logout SUCCESS! Cookie cleared.");
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};