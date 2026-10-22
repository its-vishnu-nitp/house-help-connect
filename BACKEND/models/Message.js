import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", // Optional: link chat to a specific booking
    },
    content: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Conversation lookups in both directions + per-conversation history.
messageSchema.index({ sender: 1, receiver: 1, createdAt: 1 });
messageSchema.index({ receiver: 1, sender: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);