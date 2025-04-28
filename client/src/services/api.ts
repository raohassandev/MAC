import axios from 'axios';

// Create base URL based on environment
const baseURL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3333/api';

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

export default API;