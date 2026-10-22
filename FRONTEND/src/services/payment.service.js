import api from './api';

export const paymentService = {
  // Every payment the logged-in user is a party to (as client or professional)
  getMyPayments: async () => {
    const response = await api.get('/payments/mine');
    return response.data;
  },

  // The persisted payment receipt for one booking
  getPaymentByBooking: async (bookingId) => {
    const response = await api.get(`/payments/${bookingId}`);
    return response.data;
  }
};
