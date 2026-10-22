import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["booking_update", "new_message", "payment_alert", "system"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String }, // Enhancement: URL to redirect user when they click the notification
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Inbox query: a user's notifications, unread first-class, newest first.
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);