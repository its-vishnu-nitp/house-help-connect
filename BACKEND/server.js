import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import AppError from "./utils/AppError.js";
import errorHandler from "./middlewares/errorMiddleware.js";

// Load env vars
dotenv.config();

const app = express();

// Security headers (the API serves JSON only, so defaults are fine)
app.use(helmet());

// Gzip responses
app.use(compression());

// Rate limiting: a generous global ceiling per IP, plus a stricter
// limiter on auth so credential guessing gets expensive fast.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later", error: "Too many requests, please try again later" },
});
app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many authentication attempts, please try again later", error: "Too many authentication attempts, please try again later" },
});

// Allowed Origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://house-help-connect-one.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true, // Allows cookies / authorization headers across origins
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// Health Check Endpoint
app.get("/", (req, res) => {
  return res.json({ message: "🏡 House Help Connect API is running..." });
});

// API Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);

// JSON 404 for unknown API routes (anything else falls through to the
// frontend host in deployment; the API itself always answers in JSON)
app.use("/api", (req, res, next) => {
  return next(new AppError(`API route not found: ${req.method} ${req.originalUrl}`, 404));
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5500;

// Start Server AFTER connecting to DB
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `🚀 Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("Failed to connect to Database. Server not started.", error);
  });
