import { Router } from "express";
import { createReview, getWorkerReviews, getReviewByBooking } from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// Public: reviews shown on a worker's profile (keyed by the worker's User id)
router.get("/professional/:professionalId", getWorkerReviews);

// Private: only the client of a completed booking can review it
router.post("/", protect, createReview);

// Private: the review written for one booking, or null (reviewed-state
// check that survives page refreshes)
router.get("/booking/:bookingId", protect, getReviewByBooking);

export default router;
