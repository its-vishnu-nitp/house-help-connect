import Booking from "../models/Booking.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Utility function to generate a readable, unique booking ID (e.g., BKG-1234).
 */
const generateBookingId = () => `BKG-${Math.floor(1000 + Math.random() * 9000)}`;

/**
 * Creates a new booking request.
 * Called when a client requests a service from a professional worker.
 */
/**
 * Creates a new booking request.
 * Called when a client requests a service from a professional worker.
 */
export const createBooking = asyncHandler(async (req, res, next) => {
  ////console.log(`🟡 [BOOKING] Create endpoint hit! Client ID: ${req.user.id} requesting Pro ID: ${req.body.professionalId}`);
  ////console.log("🟡 [DEBUG] Received req.body:", req.body);

  if (req.user.role !== "client") {
    ////console.log("🔴 [BOOKING] Create FAILED: Non-client attempted to book.");
    return next(new AppError("Only clients can create bookings", 403));
  }

  // Safely extract from either naming convention
  const {
    professionalId,
    service,
    serviceCategory,
    date,
    time,
    notes,
    basePrice,
    hourlyRate
  } = req.body;

  const targetService = service || serviceCategory;
  // Calculate a valid non-zero base price if hourlyRate is passed or default
  const numRate = Number(hourlyRate) || 0;
  const targetPrice = basePrice !== undefined && basePrice > 0 ? Number(basePrice) : (numRate > 0 ? numRate * 2 : 500);

  if (!professionalId || !targetService || !date || !time) {
    ////console.log("🔴 [BOOKING] Create FAILED: Missing required details.");
    return next(new AppError("Please provide all required booking details (professional, service, date, time)", 400));
  }

  try {
    const professional = await User.findById(professionalId);
    if (!professional || professional.role !== "worker") {
      ////console.log("🔴 [BOOKING] Create FAILED: Invalid professional targeted.");
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
      scheduleStatus: "pending_pro" // Matches your Booking model enum
    });

    ////console.log(`🟢 [BOOKING] Create SUCCESS! Booking ID: ${booking.bookingId} generated.`);
    res.status(201).json({ success: true, message: "Booking requested successfully", booking });
  } catch (error) {
    console.error("🔴 [BOOKING] Create FAILED with server error:", error.message);
    return next(error);
  }
});
/**
 * Retrieves all bookings associated with the currently logged-in user.
 * Adapts the query automatically based on whether the user is a client or worker.
 */
export const getMyBookings = asyncHandler(async (req, res, next) => {
  ////console.log(`🟡 [BOOKING] Fetch all endpoint hit! Fetching for User ID: ${req.user.id}, Role: ${req.user.role}`);
  const { role, id } = req.user;
  
  try {
    const query = role === "client" ? { client: id } : { professional: id };

    const bookings = await Booking.find(query)
      .populate("client", "name")
      .populate("professional", "name")
      .sort("-createdAt");

    ////console.log(`🟢 [BOOKING] Fetch SUCCESS! Found ${bookings.length} jobs.`);
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error("🔴 [BOOKING] Fetch all FAILED:", error.message);
    return next(error);
  }
});

/**
 * Retrieves the details of a single specific booking by its MongoDB ObjectId.
 * Includes basic authorization to ensure only the involved client or professional can view it.
 */
export const getBookingById = asyncHandler(async (req, res, next) => {
  ////console.log(`🟡 [BOOKING] Fetch single endpoint hit! Fetching Booking ObjectId: ${req.params.id}`);
  
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("client", "name email")
      .populate("professional", "name email");

    if (!booking) {
      ////console.log("🔴 [BOOKING] Fetch single FAILED: Booking not found.");
      return next(new AppError("Booking not found", 404));
    }

    // Security: Only allow the involved client or professional to view it
    if (booking.client._id.toString() !== req.user.id && booking.professional._id.toString() !== req.user.id) {
      ////console.log(`🔴 [BOOKING] Fetch single FAILED: User ${req.user.id} unauthorized to view this booking.`);
      return next(new AppError("Not authorized to view this booking", 403));
    }

    ////console.log(`🟢 [BOOKING] Fetch single SUCCESS! Returned data for booking ID: ${booking.bookingId}`);
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("🔴 [BOOKING] Fetch single FAILED:", error.message);
    return next(error);
  }
});

/**
 * Updates the state/status of an existing booking.
 * Used for accepting, completing, or canceling a job.
 */
export const updateBookingStatus = asyncHandler(async (req, res, next) => {
  ////console.log(`🟡 [BOOKING] Update status endpoint hit! Booking ObjectId: ${req.params.id}`);
  const { scheduleStatus, status } = req.body;
  
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      ////console.log("🔴 [BOOKING] Update FAILED: Booking not found.");
      return next(new AppError("Booking not found", 404));
    }

    if (booking.client.toString() !== req.user.id && booking.professional.toString() !== req.user.id) {
      ////console.log(`🔴 [BOOKING] Update FAILED: User ${req.user.id} unauthorized to update.`);
      return next(new AppError("Not authorized to update this booking", 403));
    }

    if (scheduleStatus) booking.scheduleStatus = scheduleStatus;
    if (status) booking.status = status;

    await booking.save();

    ////console.log(`🟢 [BOOKING] Update SUCCESS! Booking ${booking.bookingId} updated to Status: ${status || 'N/A'}, Schedule: ${scheduleStatus || 'N/A'}`);
    res.status(200).json({ success: true, message: "Booking updated", booking });
  } catch (error) {
    console.error("🔴 [BOOKING] Update FAILED:", error.message);
    return next(error);
  }
});