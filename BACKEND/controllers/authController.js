import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* =========================
   REGISTER CONTROLLER
========================= */
export const register = async (req, res) => {
  console.log("Register endpoint hit with data:", req.body);

  try {
    const { name, email, password, bio, phoneNumber } = req.body;

    // 1️⃣ Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists, use a different email",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = new User({
      username: name, // mapping frontend name → backend username
      email: email.toLowerCase(),
      password: hashedPassword,
      bio,
      phoneNumber,
    });

    // 5️⃣ Save user
    await user.save();

    // 6️⃣ Response
    return res.status(201).json({
      message: "User registration successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      message: "Server error during registration",
    });
  }
};

/* =========================
   LOGIN CONTROLLER
========================= */
export const login = async (req, res) => {
  console.log("Login endpoint hit with data:", req.body);

  try {
    const { email, password } = req.body;

    // 1️⃣ Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 5️⃣ Send token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    });

    // 6️⃣ Response (IMPORTANT: return token)
    return res.status(200).json({
      message: "Login successful",
      token, // 🔥 REQUIRED for frontend auth
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

/* =========================
   LOGOUT CONTROLLER
========================= */
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "Logged out successfully",
  });
};

/* =========================
   PROFILE CONTROLLER
========================= */
export const getProfile = async (req, res) => {
  return res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user,
  });
};
