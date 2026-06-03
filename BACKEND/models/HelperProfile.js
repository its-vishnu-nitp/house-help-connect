// --- models/HelperProfile.js ---
import mongoose from "mongoose";

const helperProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    serviceCategory: {
      type: String,
      enum: [
        "Deep Cleaning", "Daily Cooking", "Babysitting", 
        "Plumbing", "Electrical Repair", "Carpentry", 
        "Laundry & Ironing", "Pest Control"
      ],
      required: true,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    hourlyRate: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    hiredCount: { type: Number, default: 0 }, // Tracks how many times they've been booked
    skills: [{ type: String }],
    location: {
      address: String,
      city: String,
      coordinates: {
        lat: Number,
        lng: Number,
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("HelperProfile", helperProfileSchema);