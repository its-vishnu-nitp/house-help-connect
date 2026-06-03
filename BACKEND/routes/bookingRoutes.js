// --- routes/bookingRoutes.js ---
import { Router } from "express";
import { 
  createBooking, 
  getMyBookings, 
  updateBookingStatus 
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// All booking routes require the user to be logged in
router.use(protect);

router.post("/", createBooking);
router.get("/", getMyBookings);
router.put("/:id/status", updateBookingStatus);

export default router;
