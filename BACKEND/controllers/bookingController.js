import Booking from "../models/Booking.js";
import User from "../models/User.js";
import HelperProfile from "../models/HelperProfile.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import crypto from "crypto";

/**
 * Generates a readable, collision-safe booking ID (e.g., BKG-8F3K2Q).
 * 6 characters from a 36-symbol alphabet ≈ 2.1 billion combinations
 * (the old 4-digit version had only 9,000 and collided in practice);
 * the unique index on bookingId remains the final guard.
 */
const BOOKING_ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const generateBookingId = () => {
  const bytes = crypto.randomBytes(6);
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += BOOKING_ID_ALPHABET[bytes[i] % BOOKING_ID_ALPHABET.length];
  }
  return `BKG-${suffix}`;
};

/**
 * Best-effort notification: booking flows must never fail because an
 * alert couldn't be written, so errors are swallowed here.
 */
const notify = async (recipient, type, title, message) => {
  try {
    await Notification.create({ recipient, type, title, message });
  } catch {
    /* notifications are non-critical */
  }
};

/** Throws 403 unless the logged-in user is one of the booking's two parties.
 *  Handles both populated user docs and raw ObjectIds. */
const assertParticipant = (booking, userId, message) => {
  const partyId = (party) => (party._id ?? party).toString();
  if (partyId(booking.client) !== userId && partyId(booking.professional) !== userId) {
    throw new AppError(message, 403);
  }
};

/**
 * Creates a new booking request.
 * Called when a client requests a service from a professional worker.
 */
export const createBooking = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "client") {
    return next(new AppError("Only clients can create bookings", 403));
  }

  // Safely extract from either naming convention. NOTE: any price fields
  // the client sends (basePrice / hourlyRate) are deliberately IGNORED —
  // the price is derived server-side from the worker's own hourly rate
  // below, so a crafted request can't book a professional for ₹1.
  const { professionalId, service, serviceCategory, date, time, notes } = req.body;

  const targetService = service || serviceCategory;

  if (!professionalId || !targetService || !date || !time) {
    return next(
      new AppError("Please provide all required booking details (professional, service, date, time)", 400)
    );
  }

  const professional = await User.findById(professionalId);
  if (!professional || professional.role !== "worker") {
    return next(new AppError("Invalid professional selected", 404));
  }

  // Server-side pricing: the UI books a standard 2-hour block, so the
  // base price is the worker's hourlyRate × 2.
  const helperProfile = await HelperProfile.findOne({ userId: professionalId });
  if (!helperProfile) {
    return next(new AppError("This professional has not completed their profile yet", 400));
  }
  // Profiles created before the register fix can carry hourlyRate: 0
  // (registration used to set it explicitly). Treat a missing/zero rate as
  // the platform default (the HelperProfile schema default) instead of
  // making the worker unbookable.
  const DEFAULT_HOURLY_RATE = 250;
  const storedRate = Number(helperProfile.hourlyRate) || 0;
  const hourlyRate = storedRate > 0 ? storedRate : DEFAULT_HOURLY_RATE;
  const targetPrice = hourlyRate * 2;

  const booking = await Booking.create({
    bookingId: generateBookingId(),
    client: req.user.id,
    professional: professionalId,
    service: targetService,
    date,
    time,
    notes: notes || "",
    pricing: { basePrice: targetPrice, tip: 0 },
    status: "upcoming",
    scheduleStatus: "pending_pro", // Matches the Booking model enum
  });

  await notify(
    professionalId,
    "booking_update",
    "New booking request",
    `${req.user.name || "A client"} requested ${targetService} on ${new Date(date).toLocaleDateString("en-IN")} at ${time}.`
  );

  res.status(201).json({ success: true, message: "Booking requested successfully", booking });
});

/**
 * Retrieves all bookings associated with the currently logged-in user.
 * Adapts the query automatically based on whether the user is a client or worker.
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  const { role, id } = req.user;
  const query = role === "client" ? { client: id } : { professional: id };

  const bookings = await Booking.find(query)
    .populate("client", "name location.city")
    .populate("professional", "name location.city")
    .sort("-createdAt");

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

/**
 * Retrieves the details of a single specific booking by its MongoDB ObjectId.
 * Only the involved client or professional can view it.
 */
export const getBookingById = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate("client", "name email location.city")
    .populate("professional", "name email location.city");

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  assertParticipant(booking, req.user.id, "Not authorized to view this booking");

  res.status(200).json({ success: true, booking });
});

/**
 * Updates the state/status of an existing booking.
 * Used for accepting, starting, completing, or canceling a job.
 *
 * STATE MACHINE (enforced here, not trusted to the client):
 * - scheduleStatus "confirmed"/"rejected" may only be set by the party the
 *   decision is waiting on: pending_pro → the WORKER decides,
 *   pending_client → the CLIENT decides. A client can therefore never
 *   confirm (or reject) their own booking request.
 * - status "active" (job started): WORKER only, only from "upcoming",
 *   and only once the schedule is "confirmed".
 * - status "completed": WORKER only, and only from "active".
 * - status "cancelled": either participant, only from "upcoming"/"active";
 *   a PAID booking that is already "active" cannot be cancelled — the job
 *   is underway and must be completed instead.
 * - A finished booking (completed/cancelled) accepts no further changes.
 *
 * The frontend's existing call shapes are preserved: worker accept sends
 * {scheduleStatus:"confirmed", status:"upcoming"}, worker reject and
 * client cancel send {scheduleStatus:"rejected", status:"cancelled"},
 * and start/complete send {status:"active"} / {status:"completed"}.
 */
export const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { scheduleStatus, status, tip, date, time } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  assertParticipant(booking, req.user.id, "Not authorized to update this booking");

  const actorIsClient = booking.client.toString() === req.user.id;
  const actorRole = actorIsClient ? "client" : "professional";

  const isFinished = booking.status === "completed" || booking.status === "cancelled";
  if (isFinished && (status || scheduleStatus)) {
    return next(
      new AppError(`This booking is already ${booking.status} and can no longer be changed`, 400)
    );
  }

  let outcome = null; // "confirmed" | "rejected" | "cancelled" | "started" | "completed"

  // --- 1. Cancellation (status:"cancelled", usually paired with
  //        scheduleStatus:"rejected" by the frontend) ---
  if (status === "cancelled") {
    if (booking.status !== "upcoming" && booking.status !== "active") {
      return next(new AppError("Only an upcoming or active booking can be cancelled", 400));
    }
    if (booking.paymentStatus === "paid" && booking.status === "active") {
      return next(
        new AppError("This job is already paid and in progress, so it can no longer be cancelled — it must be completed", 400)
      );
    }
    booking.status = "cancelled";
    booking.scheduleStatus = "rejected";
    outcome = "cancelled";
  }
  // --- 2. Schedule decision (confirmed / rejected) ---
  else if (scheduleStatus !== undefined) {
    if (scheduleStatus !== "confirmed" && scheduleStatus !== "rejected") {
      return next(
        new AppError("Schedule status can only be confirmed or rejected here — rescheduling opens a new decision round", 400)
      );
    }

    // Whoever the decision is pending on is the only one allowed to decide.
    const decider =
      booking.scheduleStatus === "pending_pro"
        ? "professional"
        : booking.scheduleStatus === "pending_client"
          ? "client"
          : null;

    if (!decider) {
      return next(new AppError("This booking's schedule has already been decided", 400));
    }
    if (actorRole !== decider) {
      return next(
        new AppError(
          decider === "professional"
            ? "Only the professional can respond to this booking request"
            : "Only the client can respond to this schedule change",
          403
        )
      );
    }

    if (status !== undefined && status !== "upcoming" && status !== "cancelled") {
      return next(new AppError("Invalid status sent with the schedule decision", 400));
    }

    booking.scheduleStatus = scheduleStatus;
    if (scheduleStatus === "confirmed") {
      booking.status = "upcoming";
      outcome = "confirmed";
    } else {
      booking.status = "cancelled";
      outcome = "rejected";
    }
  }
  // --- 3. Job lifecycle transitions (status only) ---
  else if (status !== undefined) {
    if (status === "active") {
      if (actorIsClient) {
        return next(new AppError("Only the professional can start the job", 403));
      }
      if (booking.scheduleStatus !== "confirmed" || booking.status !== "upcoming") {
        return next(
          new AppError("The job can only be started once the booking is confirmed and still upcoming", 400)
        );
      }
      booking.status = "active";
      outcome = "started";
    } else if (status === "completed") {
      if (actorIsClient) {
        return next(new AppError("Only the professional can mark the job completed", 403));
      }
      if (booking.status !== "active") {
        return next(
          new AppError("The job must be started (active) before it can be marked completed", 400)
        );
      }
      booking.status = "completed";
      outcome = "completed";
    } else if (status === "upcoming") {
      // Only ever valid as a no-op alongside a worker's confirm (handled
      // above). Anything else is an attempt to move a booking backwards.
      return next(new AppError("A booking cannot be moved back to upcoming", 400));
    } else {
      return next(new AppError(`Invalid booking status: ${status}`, 400));
    }
  }

  // Tip. (Date/time changes go through PUT /:id/reschedule now; they are
  // still accepted here for backward compatibility, but never on a
  // finished booking.)
  if (tip !== undefined) {
    const numTip = Number(tip);
    if (Number.isNaN(numTip) || numTip < 0) {
      return next(new AppError("Tip must be a valid non-negative amount", 400));
    }
    // A paid booking's total is final — the receipt must stay truthful.
    if (booking.paymentStatus === "paid") {
      return next(new AppError("This booking is already paid; the tip can no longer be changed", 400));
    }
    booking.pricing.tip = numTip;
  }
  if (date || time) {
    if (isFinished) {
      return next(new AppError("A finished booking cannot be rescheduled", 400));
    }
    if (date) booking.date = date;
    if (time) booking.time = time;
  }

  await booking.save();

  // Notify the other party about meaningful state changes.
  const otherParty = actorIsClient ? booking.professional : booking.client;
  if (outcome === "confirmed") {
    await notify(otherParty, "booking_update", "Booking confirmed", `Your ${booking.service} booking has been confirmed.`);
  } else if (outcome === "rejected" || outcome === "cancelled") {
    await notify(otherParty, "booking_update", "Booking cancelled", `Your ${booking.service} booking was cancelled.`);
  } else if (outcome === "started") {
    await notify(otherParty, "booking_update", "Job started", `Your ${booking.service} job has been started.`);
  } else if (outcome === "completed") {
    await notify(otherParty, "booking_update", "Job completed", `Your ${booking.service} job has been marked completed.`);
  }

  res.status(200).json({ success: true, message: "Booking updated", booking });
});

/**
 * Reschedules a booking to a new date/time.
 * Either participant can propose a new slot; doing so re-opens the
 * schedule decision for the OTHER party (client proposes → pending_pro,
 * professional proposes → pending_client), who then confirms or rejects
 * through the normal status endpoint.
 */
export const rescheduleBooking = asyncHandler(async (req, res, next) => {
  const { date, time } = req.body;

  if (!date || !time) {
    return next(new AppError("Please provide the new date and time", 400));
  }
  if (Number.isNaN(new Date(date).getTime())) {
    return next(new AppError("Please provide a valid date", 400));
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  assertParticipant(booking, req.user.id, "Not authorized to reschedule this booking");

  if (booking.status === "completed" || booking.status === "cancelled") {
    return next(new AppError(`A ${booking.status} booking cannot be rescheduled`, 400));
  }
  if (booking.status === "active") {
    return next(new AppError("A job that has already started cannot be rescheduled", 400));
  }

  const actorIsClient = booking.client.toString() === req.user.id;

  booking.date = date;
  booking.time = time;
  // The new slot re-opens the schedule decision for the OTHER party.
  booking.scheduleStatus = actorIsClient ? "pending_pro" : "pending_client";

  await booking.save();

  const otherParty = actorIsClient ? booking.professional : booking.client;
  await notify(
    otherParty,
    "booking_update",
    "Booking rescheduled",
    `Your ${booking.service} booking was moved to ${new Date(date).toLocaleDateString("en-IN")} at ${time}. Please confirm the new time.`
  );

  res.status(200).json({ success: true, message: "Booking rescheduled", booking });
});

/**
 * Records a DUMMY (simulated) payment for a booking and persists it.
 *
 * This is the actual fix for the "payment doesn't survive refresh" bug:
 * previously the frontend sent paymentStatus to the generic status endpoint,
 * which ignored it, so the database never recorded the payment.
 *
 * Only the booking's client can pay, only once, and only after the
 * professional has confirmed the schedule. Creates the Payment record and
 * mirrors the receipt fields onto the Booking so cards can render the
 * paid state straight from GET /api/bookings after any refresh.
 */
export const payBooking = asyncHandler(async (req, res, next) => {
  const { paymentMethod } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.client.toString() !== req.user.id) {
    return next(new AppError("Only the client who made this booking can pay for it", 403));
  }

  if (booking.paymentStatus === "paid") {
    return next(new AppError("This booking has already been paid", 400));
  }

  if (booking.status === "cancelled" || booking.scheduleStatus === "rejected") {
    return next(new AppError("A cancelled booking cannot be paid", 400));
  }

  if (booking.scheduleStatus !== "confirmed") {
    return next(new AppError("Payment unlocks once the professional confirms your booking", 400));
  }

  const amount = (booking.pricing?.basePrice || 0) + (booking.pricing?.tip || 0);
  const transactionId = `TXN_${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
  const method = ["UPI", "Card", "Net Banking", "Wallet"].includes(paymentMethod)
    ? paymentMethod
    : "UPI";

  // One Payment document per booking (unique index on `booking`).
  const payment = await Payment.findOneAndUpdate(
    { booking: booking._id },
    {
      $set: {
        client: booking.client,
        professional: booking.professional,
        amount,
        status: "success",
        paymentMethod: method,
        transactionId,
      },
    },
    { new: true, upsert: true }
  );

  booking.paymentStatus = "paid";
  booking.paymentMethod = payment.paymentMethod;
  booking.transactionId = payment.transactionId;
  booking.paidAt = new Date();
  await booking.save();

  await notify(
    booking.professional,
    "payment_alert",
    "Payment received",
    `You received a payment of ₹${amount} for the ${booking.service} booking (${booking.bookingId}).`
  );

  const populated = await Booking.findById(booking._id)
    .populate("client", "name location.city")
    .populate("professional", "name location.city");

  res.status(200).json({
    success: true,
    message: "Demo payment recorded successfully",
    booking: populated,
    payment,
  });
});
