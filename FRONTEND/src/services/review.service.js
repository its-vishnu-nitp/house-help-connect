import api from './api';

export const reviewService = {
  // Submit a review for a completed booking (client only, one per booking)
  createReview: async ({ bookingId, rating, comment }) => {
    const response = await api.post('/reviews', { bookingId, rating, comment });
    return response.data;
  },

  // All reviews for a worker, keyed by the worker's User id
  getWorkerReviews: async (professionalUserId) => {
    const response = await api.get(`/reviews/professional/${professionalUserId}`);
    return response.data;
  },

  // The review attached to one booking, or { review: null } — lets the UI
  // derive "already reviewed" from the server instead of local state
  getReviewByBooking: async (bookingId) => {
    const response = await api.get(`/reviews/booking/${bookingId}`);
    return response.data;
  }
};
