import api from './api';

export const bookingService = {
  // Create a new job request
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Fetch all bookings for the logged-in user (Client or Worker)
  getMyBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  // Update a booking (e.g., Worker accepts job, Client adds a tip)
  updateBookingStatus: async (bookingId, statusData) => {
    const response = await api.put(`/bookings/${bookingId}/status`, statusData);
    return response.data;
  },

  // Record a demo payment. The server persists paymentStatus + receipt
  // fields on the booking, so the paid state survives page refreshes.
  payBooking: async (bookingId, paymentMethod) => {
    const response = await api.post(`/bookings/${bookingId}/pay`, { paymentMethod });
    return response.data;
  },

  // Propose a new date/time for a booking. The booking returns to a
  // pending schedule state — the other party must re-confirm it.
  rescheduleBooking: async (bookingId, { date, time }) => {
    const response = await api.put(`/bookings/${bookingId}/reschedule`, { date, time });
    return response.data;
  }
};