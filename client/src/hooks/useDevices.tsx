import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';

interface Device {
  _id: string;
  name: string;
  ip?: string;
  port?: number;
  slaveId: number;
  enabled: boolean;
  registers: any[];
  lastSeen?: Date;
}

interface UseDevicesReturn {
  devices: Device[];
  loading: boolean;
  error: Error | null;
  refreshDevices: () => Promise<void>;
  getDevice: (id: string) => Promise<Device>;
  addDevice: (device: Omit<Device, '_id'>) => Promise<Device>;
  updateDevice: (device: Device) => Promise<Device>;
  deleteDevice: (id: string) => Promise<void>;
  loadingDevice: boolean;
  deviceError: Error | null;
}

export const useDevices = (): UseDevicesReturn => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadingDevice, setLoadingDevice] = useState(false);
  const [deviceError, setDeviceError] = useState<Error | null>(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.get('/getDevices');
      
      // Add a lastSeen field to each device for demo purposes
      const devicesWithLastSeen = response.data.map((device: Device) => ({
        ...device,
        lastSeen: device.enabled ? new Date() : undefined
      }));
      
      setDevices(devicesWithLastSeen);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch devices'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const getDevice = async (id: string): Promise<Device> => {
    setLoadingDevice(true);
    setDeviceError(null);
    
    try {
      // In a real app, you would have a dedicated endpoint for getting a single device
      // For now, we'll search the existing devices array
      const device = devices.find(d => d._id === id);
      
      if (!device) {
        throw new Error(`Device with ID ${id} not found`);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return device;
    } catch (err) {
      console.error('Error fetching device:', err);
      setDeviceError(err instanceof Error ? err : new Error('Failed to fetch device'));
      throw err;
    } finally {
      setLoadingDevice(false);
    }
  };

  const addDevice = async (device: Omit<Device,