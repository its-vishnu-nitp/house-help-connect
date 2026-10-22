import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // One review per booking — enforced at the DB level too.
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Can be either client or professional
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The person receiving the review
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String, trim: true, maxLength: 1000 },
  },
  { timestamps: true }
);

// Worker profile pages: all reviews for one professional, newest first.
reviewSchema.index({ reviewee: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);