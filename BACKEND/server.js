import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";

// Load env vars
dotenv.config();

const app = express();

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get("/", (req, res) => {
  return res.json({ message: "🏡 House Help Connect API is running (MVP Mode)..." });
});

// Core MVP API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/bookings", bookingRoutes);

// Ignored Phase 2 Routes (Stubbed)
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/payments", paymentRoutes);

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