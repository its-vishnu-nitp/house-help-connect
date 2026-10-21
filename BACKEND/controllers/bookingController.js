import Booking from "../models/Booking.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

/** Generates a readable, unique booking ID (e.g., BKG-1234). */
const generateBookingId = () => `BKG-${Math.floor(1000 + Math.random() * 9000)}`;

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

  // Safely extract from either naming convention
  const { professionalId, service, serviceCategory, date, time, notes, basePrice, hourlyRate } = req.body;

  const targetService = service || serviceCategory;
  // Calculate a valid non-zero base price if hourlyRate is passed, else default
  const numRate = Number(hourlyRate) || 0;
  const targetPrice =
    basePrice !== undefined && basePrice > 0 ? Number(basePrice) : numRate > 0 ? numRate * 2 : 500;

  if (!professionalId || !targetService || !date || !time) {
    return next(
      new AppError("Please provide all required booking details (professional, service, date, time)", 400)
    );
  }

  const professional = await User.findById(professionalId);
  if (!professional || professional.role !== "worker") {
    return next(new AppError("Invalid professional selected", 404));
  }

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
    .populate("client", "name")
    .populate("professional", "name")
    .sort("-createdAt");

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

/**
 * Retrieves the details of a single specific booking by its MongoDB ObjectId.
 * Only the involved client or professional can view it.
 */
export const getBookingById = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate("client", "name email")
    .populate("professional", "name email");

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  assertParticipant(booking, req.user.id, "Not authorized to view this booking");

  res.status(200).json({ success: true, booking });
});

/**
 * Updates the state/status of an existing booking.
 * Used for accepting, completing, or canceling a job.
 */
export const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { scheduleStatus, status } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  assertParticipant(booking, req.user.id, "Not authorized to update this booking");

  if (scheduleStatus) booking.scheduleStatus = scheduleStatus;
  if (status) booking.status = status;

  await booking.save();

  res.status(200).json({ success: true, message: "Booking updated", booking });
});
