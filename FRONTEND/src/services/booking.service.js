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

  // Update a booking (e.g., Worker accepts job, or Client pays)
  updateBookingStatus: async (bookingId, statusData) => {
    const response = await api.put(`/bookings/${bookingId}/status`, statusData);
    return response.data;
  }
};