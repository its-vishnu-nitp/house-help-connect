import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
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
    notes: { type: String, maxLength: 500 }, // Enhancement: Allow clients to add special instructions
    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "cancelled"],
      default: "upcoming",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    pricing: {
      basePrice: { type: Number, required: true },
      tip: { type: Number, default: 0 },
    },
    scheduleStatus: {
      type: String,
      enum: ["pending_client", "pending_pro", "confirmed", "rejected"],
      default: "pending_pro",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);