// --- models/EmployerProfile.js ---
import mongoose from "mongoose";

const employerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    savedProfessionals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HelperProfile",
      }
    ],
    familySize: { type: Number },
    address: { type: String },
    totalSpent: { type: Number, default: 0 }, // Matches the totalSpent in mockData
  },
  { timestamps: true }
);

export default mongoose.model("EmployerProfile", employerProfileSchema);