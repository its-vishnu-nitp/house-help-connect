/**
 * ============================================================================
 * FILE: paymentController.js
 * PURPOSE: Read-only payment views — my payment history and a single
 *          booking's receipt.
 *
 * SAFETY NOTE: this module deliberately has NO create-order / verify
 * endpoints. The old mock versions trusted a client-supplied amount and
 * let anyone who knew a transaction ID mark a booking paid — they were
 * removed, not mounted. The one and only way money-state changes is the
 * guarded demo flow: POST /api/bookings/:id/pay (payBooking), which is
 * client-only, once-only, confirmation-gated and computes the amount
 * server-side.
 * MODELS USED: Payment, Booking
 * ============================================================================
 */

import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get my payment history (as client or professional), newest first
// @route   GET /api/payments/mine
// @access  Private
export const getMyPayments = asyncHandler(async (req, res, next) => {
  const payments = await Payment.find({
    $or: [{ client: req.user.id }, { professional: req.user.id }],
  })
    .populate("booking", "service bookingId")
    .populate("client", "name")
    .populate("professional", "name")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    payments,
  });
});

// @desc    Get the payment receipt for a specific booking
// @route   GET /api/payments/:bookingId
// @access  Private (only the booking's client or professional)
export const getPaymentDetails = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  const isParticipant =
    booking.client.toString() === req.user.id ||
    booking.professional.toString() === req.user.id;

  if (!isParticipant) {
    return next(new AppError("Not authorized to view this payment", 403));
  }

  const payment = await Payment.findOne({ booking: booking._id })
    .populate("booking", "service bookingId")
    .populate("client", "name")
    .populate("professional", "name");

  if (!payment) {
    return next(new AppError("No payment found for this booking", 404));
  }

  res.status(200).json({
    success: true,
    payment,
  });
});
