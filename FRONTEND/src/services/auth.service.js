import api from './api';

const persistSession = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('currentUser', JSON.stringify(data.user));
};

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    persistSession(response.data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    persistSession(response.data);
    return response.data.user;
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  },

  isAuthenticated: () => Boolean(localStorage.getItem('token')),
};
