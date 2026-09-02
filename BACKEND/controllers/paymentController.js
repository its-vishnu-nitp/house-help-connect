/**
 * ============================================================================
 * FILE: paymentController.js
 * PURPOSE: Handles creating payment orders and verifying successful transactions.
 * MODELS USED: Payment, Booking
 * ============================================================================
 */

import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import crypto from "crypto"; // Built-in Node module for generating random IDs

// @desc    Step 1: Create a payment order (e.g., initializing Razorpay/Stripe)
// @route   POST /api/payments/create-order
// @access  Private (Clients only)
export const createPaymentOrder = asyncHandler(async (req, res, next) => {
  const { bookingId, amount } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  // Generate a mock Transaction ID (In real life, Razorpay generates this for you)
  const mockTransactionId = `TXN_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

  const payment = await Payment.create({
    booking: bookingId,
    client: req.user.id,
    professional: booking.professional,
    amount,
    transactionId: mockTransactionId,
    status: "pending"
  });

  res.status(201).json({
    success: true,
    message: "Payment order created",
    payment,
    // You would send the order ID to React here so the Razorpay popup can open
    orderId: mockTransactionId 
  });
});

// @desc    Step 2: Verify payment success & update Booking
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = asyncHandler(async (req, res, next) => {
  const { transactionId, paymentMethod } = req.body;

  const payment = await Payment.findOne({ transactionId });
  if (!payment) {
    return next(new AppError("Payment record not found", 404));
  }

  // 1. Update Payment Record
  payment.status = "success";
  payment.paymentMethod = paymentMethod || "Online";
  await payment.save();

  // 2. Update the actual Booking status to 'paid'
  await Booking.findByIdAndUpdate(payment.booking, {
    paymentStatus: "paid",
    status: "completed"
  });

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    payment
  });
});

// @desc    Get payment receipt for a specific booking
// @route   GET /api/payments/:bookingId
// @access  Private
export const getPaymentDetails = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findOne({ booking: req.params.bookingId })
    .populate("client", "name email")
    .populate("professional", "name");

  if (!payment) {
    return next(new AppError("No payment found for this booking", 404));
  }

  res.status(200).json({
    success: true,
    payment
  });
});