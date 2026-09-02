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

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true, // IMPORTANT: This allows cookies (JWT) to be sent across origins
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
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
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to Database. Server not started.", error);
});