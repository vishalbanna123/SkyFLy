import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://flysmart-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Flight APIs
export const flightAPI = {
  searchFlights: (departure, arrival, departureDate) =>
    api.get('/flights/search', {
      params: { departure, arrival, departureDate },
    }),
  getAllFlights: (page = 1, limit = 10) =>
    api.get('/flights', { params: { page, limit } }),
  getFlightById: (id) => api.get(`/flights/${id}`),
};

// Booking APIs
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getUserBookings: (page = 1, limit = 10) =>
    api.get('/bookings', { params: { page, limit } }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

// Payment APIs
export const paymentAPI = {
  createPayment: (data) => api.post('/payments', data),
  getUserPayments: (page = 1, limit = 10) =>
    api.get('/payments', { params: { page, limit } }),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  refundPayment: (id) => api.put(`/payments/${id}/refund`),
};

// User APIs
export const userAPI = {
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (data) => api.put('/users/profile', data),
};

export default api;
