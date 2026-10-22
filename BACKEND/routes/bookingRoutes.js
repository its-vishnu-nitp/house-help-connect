import express from "express";
import { protect, requireAadhaar } from "../middlewares/authMiddleware.js";
import { createBooking, getMyBookings, updateBookingStatus, getBookingById, payBooking, rescheduleBooking } from "../controllers/bookingController.js";

const router = express.Router();

// Protected by Auth AND Aadhaar KYC
router.post("/", protect, requireAadhaar, createBooking);
router.put("/:id/status", protect, requireAadhaar, updateBookingStatus);

// Just needs Auth to view
router.get("/", protect, getMyBookings);
router.get("/:id", protect, getBookingById);

// Reschedule — participants only (enforced in the controller). No
// requireAadhaar here by design: moving a slot shouldn't be gated on KYC.
router.put("/:id/reschedule", protect, rescheduleBooking);

// Demo payment — persists payment state on the booking (client only,
// enforced in the controller)
router.post("/:id/pay", protect, requireAadhaar, payBooking);

export default router;