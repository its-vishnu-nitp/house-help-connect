import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { // 👈 Changed from username to name
      type: String, 
      required: [true, "Name is required"],
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: [true, "Password is required"],
      select: false 
    },
    role: { // 👈 Added role so the frontend can route properly
      type: String,
      enum: ["client", "worker", "admin"],
      default: "client",
      required: true
    },
    phoneNumber: { type: String },
    bio: { type: String },
    profilePicture: { type: String },
  },
  {
    timestamps: true 
  }
);

const User = mongoose.model("User", userSchema);
export default User;