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
    familySize: { type: Number, min: 1 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("EmployerProfile", employerProfileSchema);