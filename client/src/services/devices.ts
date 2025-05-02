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
    // Always use localStorage in development mode
    console.log('Using localStorage for devices (dev mode)');
    const storedDevices = JSON.parse(localStorage.getItem('devices') || '[]');
    
    // Return some sample devices if none in localStorage
    if (storedDevices.length === 0) {
      const sampleDevices = [
        {
          _id: 'sample_device_1',
          name: 'Sample PLC Device',
          connectionType: 'tcp',
          ip: '192.168.1.100',
          port: 502,
          slaveId: 1,
          enabled: true,
          make: 'Siemens',
          model: 'S7-1200',
          tags: ['production', 'plc'],
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSeen: new Date()
        },
        {
          _id: 'sample_device_2',
          name: 'Temperature Sensor',
          connectionType: 'tcp',
          ip: '192.168.1.101',
          port: 502,
          slaveId: 2,
          enabled: false,
          make: 'ABB',
          model: 'TempSense X5',
          tags: ['temperature', 'monitoring'],
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSeen: new Date(Date.now() - 86400000) // 1 day ago
        }
      ];
      
      // Save sample devices to localStorage
      localStorage.setItem('devices', JSON.stringify(sampleDevices));
      return sampleDevices;
    }
    
    return storedDevices;
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
}

export async function getDevice(id: string): Promise<Device> {
  try {
    // Always use localStorage in development mode
    console.log('Using localStorage for getDevice (dev mode):', id);
    const storedDevices = JSON.parse(localStorage.getItem('devices') || '[]');
    
    // Find the device by ID
    const device = storedDevices.find((d: any) => d._id === id);
    
    if (device) {
      return device;
    }
    
    // If device not found, create a sample one with the given ID
    console.warn(`Device with ID ${id} not found in localStorage, creating sample`);
    const sampleDevice = {
      _id: id,
      name: `Device ${id.substring(0, 5)}`,
      connectionType: 'tcp',
      ip: '192.168.1.100',
      port: 502,
      slaveId: 1,
      enabled: true,
      make: 'Siemens',
      model: 'S7-1200',
      tags: ['sample'],
      registers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSeen: new Date()
    };
    
    // Save to localStorage
    storedDevices.push(sampleDevice);
    localStorage.setItem('devices', JSON.stringify(storedDevices));
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return sampleDevice;
  } catch (error) {
    console.error('Error getting device:', error);
    throw new Error('Failed to get device');
  }
}

export async function addDevice(device: BaseDevice): Promise<Device> {
  try {
    // Ensure all required properties are present
    const preparedDevice = ensureDeviceProperties(device);
    
    // Always use localStorage in development mode
    console.log('Using localStorage for adding device (dev mode)');
    
    // Generate a random ID 
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
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    return newDevice;
  } catch (error) {
    console.error('Error adding device:', error);
    throw error;
  }
}

export async function updateDevice(device: Partial<Device> & { _id: string }): Promise<Device> {
  try {
    console.log('Using localStorage for updateDevice (dev mode):', device._id);
    
    // Get existing devices
    const storedDevices = JSON.parse(localStorage.getItem('devices') || '[]');
    
    // Find the device to update
    const index = storedDevices.findIndex((d: any) => d._id === device._id);
    
    if (index === -1) {
      throw new Error(`Device with ID ${device._id} not found`);
    }
    
    // Update the device
    const updatedDevice = {
      ...storedDevices[index],
      ...device,
      updatedAt: new Date()
    };
    
    // Save back to localStorage
    storedDevices[index] = updatedDevice;
    localStorage.setItem('devices', JSON.stringify(storedDevices));
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return updatedDevice;
  } catch (error) {
    console.error('Error updating device:', error);
    throw new Error('Failed to update device');
  }
}

export async function deleteDevice(id: string): Promise<boolean> {
  try {
    console.log('Using localStorage for deleteDevice (dev mode):', id);
    
    // Get existing devices
    const storedDevices = JSON.parse(localStorage.getItem('devices') || '[]');
    
    // Filter out the device to delete
    const filteredDevices = storedDevices.filter((d: any) => d._id !== id);
    
    // Check if a device was actually removed
    if (filteredDevices.length === storedDevices.length) {
      console.warn(`Device with ID ${id} not found for deletion`);
    }
    
    // Save back to localStorage
    localStorage.setItem('devices', JSON.stringify(filteredDevices));
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return true;
  } catch (error) {
    console.error('Error deleting device:', error);
    throw new Error('Failed to delete device');
  }
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