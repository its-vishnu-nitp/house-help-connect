import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
export const register = async (req, res) => {
  try {
    const { username, email, password, bio, phoneNumber } = req.body;
    //1. validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password fields are required" });
    }
    //2. check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already exists use different email" });
    }
    //3. hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    //4. create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      bio,
      phoneNumber,
    });
    //5. save user
    await user.save();
    //6. response
    return res
      .status(201)
      .json({ message: "User registration successful", newUser:{name : user.username, email: user.email} });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    //check if user is already logined
    // if (req.cookies.token) {
    //   return res.status(400).json({
    //     message: "User already logged in",
    //   });
    // }
    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Generate JWT (DYNAMIC expiry)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // 5. Send token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    });

    // 6. Response (NO password)
    return res.status(200).json({
      message: "Login successful",
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

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "Logged out successfully",
  });
};

export const getProfile = async (req, res) => {
  return res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user,
  });
};
