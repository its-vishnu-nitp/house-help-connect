import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, 
      required: [true, "Name is required"],
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"]
    },
    password: { 
      type: String, 
      required: [true, "Password is required"],
      select: false 
    },
    role: {
      type: String,
      enum: ["client", "worker", "admin"],
      default: "client",
      required: true
    },
    phoneNumber: { 
      type: String,
      match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"]
    },
    bio: { type: String, maxLength: 500 },
    profilePicture: { type: String, default: "default-avatar.png" },
    isActive: { type: Boolean, default: true }, // Enhancement: For soft-deleting users
    // Aadhaar KYC Fields
    aadhaarNumber: { 
      type: String, 
      sparse: true, 
      unique: true, 
      select: false, 
      match: [/^\d{12}$/, "Please enter a valid 12-digit Aadhaar number"] 
    },
    isAadhaarVerified: { type: Boolean, default: false },
    // Centralized Location
    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] },
      },
    },
  },
  {
    timestamps: true 
  }
);

export default mongoose.model("User", userSchema);