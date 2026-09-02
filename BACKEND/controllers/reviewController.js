/**
 * ============================================================================
 * FILE: reviewController.js
 * PURPOSE: Handles submitting ratings and calculating average worker scores.
 * MODELS USED: Review, Booking, HelperProfile
 * ============================================================================
 */

import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import HelperProfile from "../models/HelperProfile.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Create a new review for a completed booking
// @route   POST /api/reviews
// @access  Private (Clients only)
export const createReview = asyncHandler(async (req, res, next) => {
  const { bookingId, rating, comment } = req.body;

  // 1. Verify the booking exists and is completed
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.status !== "completed") {
    return next(new AppError("You can only review completed jobs", 400));
  }

  // 2. Ensure only the client who made the booking can review it
  if (booking.client.toString() !== req.user.id) {
    return next(new AppError("Not authorized to review this booking", 403));
  }

  // 3. Check if a review already exists for this booking
  const existingReview = await Review.findOne({ booking: bookingId });
  if (existingReview) {
    return next(new AppError("You have already reviewed this booking", 400));
  }

  // 4. Create the Review
  const review = await Review.create({
    booking: bookingId,
    reviewer: req.user.id,
    reviewee: booking.professional,
    rating,
    comment
  });

  // 5. Recalculate the Worker's Average Rating
  const allReviews = await Review.find({ reviewee: booking.professional });
  const totalRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = (totalRating / allReviews.length).toFixed(1);

  await HelperProfile.findOneAndUpdate(
    { userId: booking.professional },
    { 
      rating: averageRating,
      totalReviews: allReviews.length
    }
  );

  res.status(201).json({
    success: true,
    message: "Review submitted successfully",
    review
  });
});

// @desc    Get all reviews for a specific worker
// @route   GET /api/reviews/professional/:professionalId
// @access  Public or Private
export const getWorkerReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ reviewee: req.params.professionalId })
    .populate("reviewer", "name profilePicture")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews
  });
});