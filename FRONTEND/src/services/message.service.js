import api from './api';

export const messageService = {
  // All conversations for the logged-in user, most recent first
  getConversations: async () => {
    const response = await api.get('/messages');
    return response.data;
  },

  // Full message history with one other user (oldest → newest)
  getConversation: async (otherUserId) => {
    const response = await api.get(`/messages/${otherUserId}`);
    return response.data;
  },

  // Send a message; optionally link it to a booking
  sendMessage: async ({ receiverId, content, bookingReference }) => {
    const payload = { receiverId, content };
    if (bookingReference) payload.bookingReference = bookingReference;
    const response = await api.post('/messages', payload);
    return response.data;
  },

  // Mark every message from the other user as read
  markConversationRead: async (otherUserId) => {
    const response = await api.put(`/messages/${otherUserId}/read`);
    return response.data;
  }
};
