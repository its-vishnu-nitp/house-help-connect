// --- controllers/bookingController.js ---
import Booking from "../models/Booking.js";
import User from "../models/User.js";

// Utility to generate a unique booking ID (like BKG-8890)
const generateBookingId = () => {
  return `BKG-${Math.floor(1000 + Math.random() * 9000)}`;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Clients only)
export const createBooking = async (req, res) => {
  try {
    // Ensure only clients can create bookings
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can create bookings" });
    }

    const { professionalId, service, date, time, basePrice } = req.body;

    const booking = await Booking.create({
      bookingId: generateBookingId(),
      client: req.user.id,
      professional: professionalId,
      service,
      date,
      time,
      pricing: { basePrice },
      // Defaults to 'upcoming' and 'pending_pro' based on our schema
    });

    res.status(201).json({
      success: true,
      message: "Booking requested successfully",
      booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ message: "Server error creating booking" });
  }
};

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const { role, id } = req.user;
    let query = {};

    // Dynamically query based on who is asking
    if (role === "client") {
      query = { client: id };
    } else if (role === "worker") {
      query = { professional: id };
    } else {
      return res.status(403).json({ message: "Invalid user role" });
    }

    const bookings = await Booking.find(query)
      .populate("client", "name profilePicture") // Get basic client info
      .populate("professional", "name profilePicture") // Get basic pro info
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
};

// @desc    Update booking schedule status (e.g., Pro confirms the time)
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
  try {
    const { scheduleStatus, status, paymentStatus } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Security: Ensure the user modifying the booking is either the client or the pro involved
    if (
      booking.client.toString() !== req.user.id &&
      booking.professional.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized to update this booking" });
    }

    // Update only the fields provided
    if (scheduleStatus) booking.scheduleStatus = scheduleStatus;
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update Booking Error:", error);
    res.status(500).json({ message: "Server error updating booking" });
  }
};