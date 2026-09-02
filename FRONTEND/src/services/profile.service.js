import api from './api';

export const profileService = {
  // Fetches current user + role profile on reload
  getMyProfile: async () => {
    const response = await api.get('/profiles/me');
    return response.data;
  },

  // Persists changes to MongoDB
  updateMyProfile: async (profileData) => {
    const response = await api.put('/profiles/update', profileData);
    return response.data;
  },

  // Search with infinite scroll
  searchWorkers: async (category = '', city = '', page = 1, limit = 6) => {
    const response = await api.get(
      `/profiles/search?category=${encodeURIComponent(category)}&city=${encodeURIComponent(city)}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  toggleSaveProfessional: async (workerProfileId) => {
    const response = await api.post('/profiles/save-worker', { workerProfileId });
    return response.data;
  }
};
