// client/src/services/api.ts
import axios, { AxiosInstance } from 'axios';

// Create base URL based on environment
const baseURL =
  import.meta.env.VITE_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:3333/api');

const API: AxiosInstance = axios.create({
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

// client/src/services/auth.ts
import API from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  token?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await API.post('/auth/login', credentials);

    // Store user data and token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));

    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<User> {
    const response = await API.post('/auth/register', credentials);

    // Store user data and token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));

    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await API.get('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getStoredUser(): User | null {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  },
};

// client/src/services/devices.ts
import API from './api';

export interface Register {
  name: string;
  address: number;
  length: number;
  scaleFactor?: number;
  decimalPoint?: number;
  byteOrder?: string;
  unit?: string;
}

export interface Device {
  _id: string;
  name: string;
  ip: string;
  port: number;
  slaveId: number;
  enabled: boolean;
  registers: Register[];
  lastSeen?: Date;
}

export interface DeviceReading {
  name: string;
  address: number;
  value: number | null;
  unit: string;
  error?: string;
}

export interface DeviceReadingsResponse {
  deviceId: string;
  deviceName: string;
  timestamp: Date;
  readings: DeviceReading[];
}

export const deviceService = {
  async getDevices(): Promise<Device[]> {
    const response = await API.get('/devices');
    return response.data;
  },

  async getDevice(id: string): Promise<Device> {
    const response = await API.get(`/devices/${id}`);
    return response.data;
  },

  async createDevice(device: Omit<Device, '_id'>): Promise<Device> {
    const response = await API.post('/devices', device);
    return response.data;
  },

  async updateDevice(device: Device): Promise<Device> {
    const response = await API.put(`/devices/${device._id}`, device);
    return response.data;
  },

  async deleteDevice(id: string): Promise<{ message: string; id: string }> {
    const response = await API.delete(`/devices/${id}`);
    return response.data;
  },

  async testConnection(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await API.post(`/devices/${id}/test`);
    return response.data;
  },

  async readRegisters(id: string): Promise<DeviceReadingsResponse> {
    const response = await API.get(`/devices/${id}/read`);
    return response.data;
  },
};

// client/src/services/profiles.ts
import API from './api';
import { Device } from './devices';

export type ProfileMode = 'cooling' | 'heating' | 'auto' | 'dehumidify';

export interface ScheduleTime {
  id: string;
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  startTime: string;
  endTime: string;
}

export interface Schedule {
  active: boolean;
  times: ScheduleTime[];
}

export interface Profile {
  _id: string;
  name: string;
  description: string;
  targetTemperature: number;
  temperatureRange: [number, number];
  fanSpeed: number;
  mode: ProfileMode;
  schedule: Schedule;
  assignedDevices: string[] | Device[];
  isTemplate: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileApplyResult {
  deviceId: string;
  deviceName: string;
  success: boolean;
  message: string;
}

export interface ProfileApplyResponse {
  profileId: string;
  profileName: string;
  timestamp: Date;
  results: ProfileApplyResult[];
}

export const profileService = {
  async getProfiles(): Promise<Profile[]> {
    const response = await API.get('/profiles');
    return response.data;
  },

  async getProfile(id: string): Promise<Profile> {
    const response = await API.get(`/profiles/${id}`);
    return response.data;
  },

  async createProfile(
    profile: Omit<Profile, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<Profile> {
    const response = await API.post('/profiles', profile);
    return response.data;
  },

  async updateProfile(profile: Profile): Promise<Profile> {
    const response = await API.put(`/profiles/${profile._id}`, profile);
    return response.data;
  },

  async deleteProfile(id: string): Promise<{ message: string; id: string }> {
    const response = await API.delete(`/profiles/${id}`);
    return response.data;
  },

  async duplicateProfile(id: string): Promise<Profile> {
    const response = await API.post(`/profiles/${id}/duplicate`);
    return response.data;
  },

  async applyProfile(id: string): Promise<ProfileApplyResponse> {
    const response = await API.post(`/profiles/${id}/apply`);
    return response.data;
  },

  async getTemplateProfiles(): Promise<Profile[]> {
    const response = await API.get('/profiles/templates');
    return response.data;
  },

  async createFromTemplate(
    templateId: string,
    data: { name?: string; description?: string; assignedDevices?: string[] }
  ): Promise<Profile> {
    const response = await API.post(
      `/profiles/from-template/${templateId}`,
      data
    );
    return response.data;
  },
};
