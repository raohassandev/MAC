import { useCallback, useEffect, useState } from 'react';
import API from '../services/api';
import { Device } from '../types/device.types';

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
      // Also ensure each device has a tags array
      const devicesWithDefaults = response.data.map((device: Device) => ({
        ...device,
        lastSeen: device.enabled ? new Date() : undefined,
        tags: device.tags || [], // Ensure tags property exists, default to empty array
      }));

      setDevices(devicesWithDefaults);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch devices')
      );
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
      const device = devices.find((d) => d._id === id);

      if (!device) {
        throw new Error(`Device with ID ${id} not found`);
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return device;
    } catch (err) {
      console.error('Error fetching device:', err);
      setDeviceError(
        err instanceof Error ? err : new Error('Failed to fetch device')
      );
      throw err;
    } finally {
      setLoadingDevice(false);
    }
  };

  const addDevice = async (device: Omit<Device, '_id'>): Promise<Device> => {
    try {
      // Ensure device has tags property
      const deviceWithTags = {
        ...device,
        tags: device.tags || [],
      };

      const response = await API.post('/addDevice', deviceWithTags);
      await fetchDevices(); // Refresh the devices list
      return response.data;
    } catch (err) {
      console.error('Error adding device:', err);
      throw err instanceof Error ? err : new Error('Failed to add device');
    }
  };

  const updateDevice = async (device: Device): Promise<Device> => {
    try {
      // Ensure device has tags property
      const deviceWithTags = {
        ...device,
        tags: device.tags || [],
      };

      const response = await API.put(
        `/updateDevice/${device._id}`,
        deviceWithTags
      );

      // Update the local state
      setDevices((prevDevices) =>
        prevDevices.map((d) => (d._id === device._id ? response.data : d))
      );

      return response.data;
    } catch (err) {
      console.error('Error updating device:', err);
      throw err instanceof Error ? err : new Error('Failed to update device');
    }
  };

  const deleteDevice = async (id: string): Promise<void> => {
    try {
      await API.delete(`/deleteDevice/${id}`);

      // Update the local state
      setDevices((prevDevices) => prevDevices.filter((d) => d._id !== id));
    } catch (err) {
      console.error('Error deleting device:', err);
      throw err instanceof Error ? err : new Error('Failed to delete device');
    }
  };

  return {
    devices,
    loading,
    error,
    refreshDevices: fetchDevices,
    getDevice,
    addDevice,
    updateDevice,
    deleteDevice,
    loadingDevice,
    deviceError,
  };
};
