import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import EmployerProfile from "../models/EmployerProfile.js";
import HelperProfile from "../models/HelperProfile.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Generates a JWT, sets it in an HTTP-only cookie,
 * and returns the success response to the client.
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
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return next(new AppError("Name, email, password, and role are required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already exists", 409));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await User.create(
      [{ name, email, password: hashedPassword, role }],
      { session }
    );

    // Create the specific profile based on role
    if (role === "client") {
      await EmployerProfile.create([{ userId: newUser._id }], { session });
    } else if (role === "worker") {
      await HelperProfile.create(
        [{ userId: newUser._id, serviceCategory: "Deep Cleaning", hourlyRate: 0 }],
        { session }
      );
    }

    await session.commitTransaction();

    generateTokenAndRespond(newUser, 201, res, "User registration successful");
  } catch (error) {
    await session.abortTransaction();
    return next(error);
  } finally {
    session.endSession();
  }
});

/**
 * Authenticates a user.
 * Verifies the email and password, then issues a JWT token for session management.
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  generateTokenAndRespond(user, 200, res, "Login successful");
});

/**
 * Logs out the user.
 * Clears the HTTP-only JWT cookie across the entire domain to terminate the active session.
 */
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/", // Ensures cookie clearance regardless of the requesting route
    expires: new Date(0), // Forces immediate expiration in the browser
  });

  return res.status(200).json({ success: true, message: "Logged out successfully" });
};
