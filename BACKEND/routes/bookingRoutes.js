import express from "express";
import { protect, requireAadhaar } from "../middlewares/authMiddleware.js";
import { createBooking, getMyBookings, updateBookingStatus, getBookingById } from "../controllers/bookingController.js";

const router = express.Router();

// Protected by Auth AND Aadhaar KYC
router.post("/", protect, requireAadhaar, createBooking);
router.put("/:id/status", protect, requireAadhaar, updateBookingStatus);

// Just needs Auth to view
router.get("/", protect, getMyBookings);
router.get("/:id", protect, getBookingById);

export default router;