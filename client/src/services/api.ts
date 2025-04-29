import axios from 'axios';

// Use environment variable for the API URL instead of hardcoding
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

// Create the axios instance with the correct base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token functions
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // Also store the token in localStorage for persistence across page refreshes
  localStorage.setItem('token', token);
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
};

// Load token from storage on initial load
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Login API call
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user API call
export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Device API calls
export const getDevices = async () => {
  try {
    const response = await api.get('/devices');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDeviceById = async (id: string) => {
  try {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createDevice = async (deviceData: any) => {
  try {
    const response = await api.post('/devices', deviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDevice = async (id: string, deviceData: any) => {
  try {
    const response = await api.put(`/devices/${id}`, deviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDevice = async (id: string) => {
  try {
    const response = await api.delete(`/devices/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const testDevice = async (id: string) => {
  try {
    const response = await api.post(`/devices/${id}/test`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const readDeviceRegisters = async (id: string) => {
  try {
    const response = await api.get(`/devices/${id}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Profile API calls
export const getProfiles = async () => {
  try {
    const response = await api.get('/profiles');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfileById = async (id: string) => {
  try {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProfile = async (profileData: any) => {
  try {
    const response = await api.post('/profiles', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (id: string, profileData: any) => {
  try {
    const response = await api.put(`/profiles/${id}`, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProfile = async (id: string) => {
  try {
    const response = await api.delete(`/profiles/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const applyProfile = async (id: string) => {
  try {
    const response = await api.post(`/profiles/${id}/apply`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
