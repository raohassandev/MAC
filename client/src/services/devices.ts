// client/src/services/devices.ts
import api from '../api/client';

// export interface Register {
//   name: string;
//   address: number;
//   length: number;
//   scaleFactor?: number;
//   decimalPoint?: number;
//   byteOrder?: string;
//   unit?: string;
// }

// export interface Device {
//   _id: string;
//   name: string;
//   ip: string;
//   port: number;
//   slaveId: number;
//   enabled: boolean;
//   registers: Register[];
//   lastSeen?: Date;
// }

// export interface DeviceReading {
//   name: string;
//   address: number;
//   value: number | null;
//   unit: string;
//   error?: string;
// }

// export interface DeviceReadingsResponse {
//   deviceId: string;
//   deviceName: string;
//   timestamp: Date;
//   readings: DeviceReading[];
// }

// export const deviceService = {
//   async getDevices(): Promise<Device[]> {
//     const response = await API.get('/devices');
//     return response.data;
//   },

//   async getDevice(id: string): Promise<Device> {
//     const response = await API.get(`/devices/${id}`);
//     return response.data;
//   },

//   async createDevice(device: Omit<Device, '_id'>): Promise<Device> {
//     const response = await API.post('/devices', device);
//     return response.data;
//   },

//   async updateDevice(device: Device): Promise<Device> {
//     const response = await API.put(`/devices/${device._id}`, device);
//     return response.data;
//   },

//   async deleteDevice(id: string): Promise<{ message: string; id: string }> {
//     const response = await API.delete(`/devices/${id}`);
//     return response.data;
//   },

//   async testConnection(
//     id: string
//   ): Promise<{ success: boolean; message: string }> {
//     const response = await API.post(`/devices/${id}/test`);
//     return response.data;
//   },

//   async readRegisters(id: string): Promise<DeviceReadingsResponse> {
//     const response = await API.get(`/devices/${id}/read`);
//     return response.data;
//   },
// };
// client/src/services/devices.ts
import { Device as BaseDevice } from '../types/device.types';

// Extend the base Device interface for the service
export interface Device extends BaseDevice {
  // Add any service-specific fields needed by DeviceManagement.tsx
  registers?: Array<{
    rangeName: string;
    startRegister: number;
    length: number;
    functionCode: number;
  }>;
  // Ensure tags is always required for the service layer
  tags: string[];
  // Ensure make and model are required for the service layer
  make: string;
  model: string;
}

// Define the service response type
export interface DeviceServiceResponse {
  success: boolean;
  message: string;
  data?: Device | Device[];
}

// Define a type guard to check if an object is a Device
export function isDevice(obj: any): obj is Device {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj._id === 'string' &&
    typeof obj.name === 'string'
  );
}

// Helper function to ensure all required properties are defined
export function ensureDeviceProperties(device: BaseDevice): Device {
  return {
    ...device,
    registers: device.registerRanges || [],
    tags: device.tags || [],
    make: device.make || '',
    model: device.model || '',
  };
}

// Function to convert service Device to BaseDevice
export function convertToBaseDevice(serviceDevice: Device): BaseDevice {
  // Extract properties that match the BaseDevice interface
  const {
    _id,
    name,
    ip,
    port,
    slaveId,
    serialPort,
    baudRate,
    dataBits,
    stopBits,
    parity,
    connectionType,
    enabled,
    lastSeen,
    make,
    model,
    description,
    tags,
    registerRanges,
    parameterConfigs,
    createdAt,
    updatedAt,
  } = serviceDevice;

  return {
    _id,
    name,
    ip,
    port,
    slaveId,
    serialPort,
    baudRate,
    dataBits,
    stopBits,
    parity,
    connectionType,
    enabled,
    lastSeen,
    make,
    model,
    description,
    tags,
    registerRanges,
    parameterConfigs,
    createdAt,
    updatedAt,
  };
}

// Export functions that would typically be part of the service
export async function getDevices(): Promise<Device[]> {
  try {
    // Try to use the API first
    try {
      const response = await api.get('/devices');
      return response.data;
    } catch (error: any) {
      // Fall back to localStorage if API fails
      console.warn('API call failed, falling back to localStorage for devices');
      const storedDevices = JSON.parse(localStorage.getItem('devices') || '[]');
      return storedDevices;
    }
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
}

export async function getDevice(_id: string): Promise<Device | null> {
  // Implementation would go here
  return null;
}

export async function addDevice(device: BaseDevice): Promise<Device> {
  try {
    // Ensure all required properties are present
    const preparedDevice = ensureDeviceProperties(device);
    
    try {
      // Try to use the real API endpoint
      const response = await api.post('/devices', preparedDevice);
      return response.data;
    } catch (error: any) {
      console.warn('API call failed, using localStorage for device creation');
      
      // Generate a random ID (in a real app, this would come from the backend)
      const newDevice: Device = {
        ...preparedDevice,
        _id: `device_${Math.floor(Math.random() * 10000)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Store in localStorage for persistence between page reloads
      const storedDevices = JSON.parse(localStorage.getItem('devices') || '[]');
      storedDevices.push(newDevice);
      localStorage.setItem('devices', JSON.stringify(storedDevices));
      
      return newDevice;
    }
  } catch (error) {
    console.error('Error adding device:', error);
    throw error;
  }
}

export async function updateDevice(device: Partial<Device> & { _id: string }): Promise<Device> {
  // Implementation would go here
  return {
    _id: device._id,
    name: device.name || '',
    connectionType: device.connectionType || 'tcp',
    slaveId: device.slaveId || 0,
    enabled: device.enabled !== undefined ? device.enabled : true,
    registers: [],
    tags: [],
    make: '',
    model: '',
  };
}

export async function deleteDevice(_id: string): Promise<boolean> {
  // Implementation would go here
  return true;
}

export async function testConnection(_id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Simulate a successful connection test for development
    return { success: true, message: 'Connection successful (simulated)' };
  } catch (error) {
    console.error('Error testing device connection:', error);
    throw error;
  }
}