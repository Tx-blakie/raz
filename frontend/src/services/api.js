import axios from 'axios';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAuthenticated', 'true');
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error during registration';
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAuthenticated', 'true');
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Invalid email or password';
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error getting user profile';
    }
  },
};

export default api; 