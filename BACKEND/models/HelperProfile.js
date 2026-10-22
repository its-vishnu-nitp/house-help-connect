import mongoose from "mongoose";

const helperProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    services: {
      type: [String],
      default: ["Deep Cleaning"],
    },
    serviceCategory: {
      type: String,
      default: "Deep Cleaning",
    },
    hourlyRate: { type: Number, default: 250 },
    experience: { type: Number, default: 1 },
    bio: { type: String, maxLength: 1000 },
    isAvailable: { type: Boolean, default: true },
    // Aggregate review stats, maintained by the review flow.
    // (Previously written by reviewController/seed but missing from the
    // schema, so Mongoose silently dropped them and search sorted on air.)
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("HelperProfile", helperProfileSchema);