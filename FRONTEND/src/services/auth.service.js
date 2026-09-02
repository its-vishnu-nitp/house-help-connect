import api from './api';

const USE_BACKEND = true;

export const authService = {
  register: async (userData) => {
    if (USE_BACKEND) {
      const response = await api.post('/auth/register', userData);
      
      // FIX: Save token and user to localStorage so the app knows we are instantly logged in!
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
      
      return response.data;
    } else {
      const existingUsers = JSON.parse(localStorage.getItem('hhc_users')) || [];
      if (existingUsers.some((u) => u.email === userData.email)) {
        throw new Error("An account with this email already exists.");
      }
      const newUser = { id: Date.now(), ...userData };
      existingUsers.push(newUser);
      localStorage.setItem("hhc_users", JSON.stringify(existingUsers));

      localStorage.setItem("currentUser", JSON.stringify(newUser));
      localStorage.setItem("token", "dummy-token-123");
      return newUser;
    }
  },

  login: async (credentials) => {
    if (USE_BACKEND) {
      const response = await api.post('/auth/login', credentials);
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
      
      return response.data.user;
    } else {
      const existingUsers = JSON.parse(localStorage.getItem("hhc_users")) || [];
      const foundUser = existingUsers.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );
      if (!foundUser) throw new Error("Invalid email or password.");

      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      localStorage.setItem("token", "dummy-token-123");
      return foundUser;
    }
  },

  logout: () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  },

  isAuthenticated: () => {
    return Boolean(localStorage.getItem("token"));
  }
};