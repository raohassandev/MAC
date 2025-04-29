// Add auth token to the request header
const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Clear auth token from header
const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

// Auth API calls
const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

// Device API calls
const getDevices = async () => {
  try {
    const response = await api.get('/devices');
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const getDeviceById = async (id: string) => {
  try {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const createDevice = async (deviceData: any) => {
  try {
    const response = await api.post('/devices', deviceData);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const updateDevice = async (id: string, deviceData: any) => {
  try {
    const response = await api.put(`/devices/${id}`, deviceData);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const deleteDevice = async (id: string) => {
  try {
    const response = await api.delete(`/devices/${id}`);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const testDeviceConnection = async (id: string) => {
  try {
    const response = await api.post(`/devices/${id}/test`);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const readDeviceRegisters = async (id: string) => {
  try {
    const response = await api.get(`/devices/${id}/read`);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

// Profile API calls
const getProfiles = async () => {
  try {
    const response = await api.get('/profiles');
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const getProfileById = async (id: string) => {
  try {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const createProfile = async (profileData: any) => {
  try {
    const response = await api.post('/profiles', profileData);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const updateProfile = async (id: string, profileData: any) => {
  try {
    const response = await api.put(`/profiles/${id}`, profileData);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const deleteProfile = async (id: string) => {
  try {
    const response = await api.delete(`/profiles/${id}`);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const applyProfile = async (id: string) => {
  try {
    const response = await api.post(`/profiles/${id}/apply`);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

// Error handler utility
const handleApiError = (error: any) => {
  if (error.response) {
    // The request was made, but the server responded with an error
    const errorMessage = error.response.data.message || 'Something went wrong';
    return new Error(errorMessage);
  } else if (error.request) {
    // The request was made, but no response was received
    return new Error('No response from server. Please check your connection.');
  } else {
    // Something happened in setting up the request
    return new Error(error.message || 'Error setting up request');
  }
};

// Export all API functions
export default {
  setAuthToken,
  clearAuthToken,
  login,
  getMe,
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  testDeviceConnection,
  readDeviceRegisters,
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  applyProfile,
};
