import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Get token from Headers OR Cookies
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.userId).select("-password");
    if (!currentUser) {
      return next(new AppError("The user belonging to this token does no longer exist.", 401));
    }

    // 4. Check if user has been deactivated
    if (currentUser.isActive === false) {
      return next(new AppError("This account has been deactivated. Please contact support.", 403));
    }

    // 5. GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError("Invalid token. Please log in again.", 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError("Your token has expired! Please log in again.", 401));
    }
    return next(error);
  }
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
  };
};

export const requireAadhaar = (req, res, next) => {
  // Role-aware Aadhaar gate:
  // - Workers must be Aadhaar-verified to take bookings actions
  //   (create/respond/pay-related flows pass through the booking router,
  //   where this middleware guards the state-changing endpoints).
  // - Clients pass through — their flow has no Aadhaar step.
  if (req.user?.role === "worker" && !req.user.isAadhaarVerified) {
    return next(
      new AppError("Action denied. Please verify your Aadhaar to continue.", 403)
    );
  }

  next();
};