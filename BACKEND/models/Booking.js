// --- models/Booking.js ---
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true }, // e.g., BKG-8890
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "cancelled"],
      default: "upcoming",
    },
    scheduleStatus: {
      type: String,
      enum: ["pending_client", "pending_pro", "confirmed"],
      default: "pending_pro",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    pricing: {
      basePrice: { type: Number, required: true },
      tip: { type: Number, default: 0 },
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);