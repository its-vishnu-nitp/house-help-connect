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
  },
  { timestamps: true }
);

export default mongoose.model("HelperProfile", helperProfileSchema);