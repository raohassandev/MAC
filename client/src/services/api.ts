import axios from 'axios';

// Create base URL based on environment
const baseURL =
  process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3333/api';

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response && error.response.status === 401) {
      // Unauthorized - clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
