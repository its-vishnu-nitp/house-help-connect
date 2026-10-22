import { Router } from "express";
import {
  getMyPayments,
  getPaymentDetails,
} from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// All payment views require a logged-in user; the controllers additionally
// enforce that only a booking's own participants can see its receipt.
// NOTE: no create-order/verify routes exist here by design — paying happens
// only through POST /api/bookings/:id/pay (see paymentController header).
router.use(protect);

// My payment history — declared before /:bookingId so "mine" isn't
// treated as a booking id.
router.get("/mine", getMyPayments);

// Receipt for one booking
router.get("/:bookingId", getPaymentDetails);

export default router;
