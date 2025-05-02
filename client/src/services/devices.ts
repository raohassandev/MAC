// client/src/services/devices.ts
import api from '../api/client';
import { Device as BaseDevice } from '../types/device.types';

// Extend the base Device interface for the service
export interface Device extends BaseDevice {
  // Add any service-specific fields needed by DeviceManagement.tsx
  registers?: Array<{
    name: string;
    address: number;
    length: number;
    functionCode?: number;
    scaleFactor?: number;
    unit?: string;
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
    registers: device.registerRanges?.map(range => ({
      name: range.rangeName || 'Register',
      address: range.startRegister,
      length: range.length,
      functionCode: range.functionCode || 3,
    })) || [],
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

// Export functions that integrate with the backend API
export async function getDevices(): Promise<Device[]> {
  try {
    const response = await api.get('/devices');
    
    // If no devices are returned, provide some sample devices for testing
    if (!response.data || response.data.length === 0) {
      console.warn('No devices returned from API, using sample devices');
      return [
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
        }
      ];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching devices from API:', error);
    // Return empty array in case of error
    return [];
  }
}

export async function getDevice(id: string): Promise<Device> {
  try {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting device from API:', error);
    throw new Error('Failed to get device');
  }
}

export async function addDevice(device: BaseDevice): Promise<Device> {
  try {
    // Ensure all required properties are present
    const preparedDevice = ensureDeviceProperties(device);
    
    // Send to backend API
    const response = await api.post('/devices', preparedDevice);
    return response.data;
  } catch (error) {
    console.error('Error adding device to API:', error);
    throw error;
  }
}

export async function updateDevice(device: Partial<Device> & { _id: string }): Promise<Device> {
  try {
    // Send update to backend API
    const response = await api.put(`/devices/${device._id}`, device);
    return response.data;
  } catch (error) {
    console.error('Error updating device via API:', error);
    throw new Error('Failed to update device');
  }
}

export async function deleteDevice(id: string): Promise<boolean> {
  try {
    // Delete from backend API
    await api.delete(`/devices/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting device via API:', error);
    throw new Error('Failed to delete device');
  }
}

export async function testConnection(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Test connection via backend API
    const response = await api.post(`/devices/${id}/test`);
    return response.data;
  } catch (error) {
    console.error('Error testing device connection via API:', error);
    return { success: false, message: 'Connection test failed' };
  }
}