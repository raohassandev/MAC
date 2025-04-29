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
