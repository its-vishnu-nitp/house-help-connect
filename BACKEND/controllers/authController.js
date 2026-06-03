// --- controllers/authController.js ---
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Utility function to generate token and send response
const generateTokenAndRespond = (user, statusCode, res, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Remove password from output
  user.password = undefined;

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
  });
};

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, bio, phoneNumber } = req.body;

  if (!name || !email || !password || !role) {
    return next(new AppError("Name, email, password, and role are required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already exists", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name, 
    email, 
    password: hashedPassword, 
    role, 
    bio, 
    phoneNumber,
  });

  generateTokenAndRespond(user, 201, res, "User registration successful");
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  // Since we set select: false in the model, we must explicitly select it here
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  generateTokenAndRespond(user, 200, res, "Login successful");
});

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ 
    success: true,
    message: "Logged out successfully" 
  });
};