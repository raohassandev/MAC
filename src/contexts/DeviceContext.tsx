import React, { ReactNode, createContext, useEffect, useState } from 'react';

import API from '../services/api';

interface Register {
  name: string;
  address: number;
  length: number;
  scaleFactor?: number;
  decimalPoint?: number;
  byteOrder?: string;
  unit?: string;
}

interface Device {
  _id: string;
  name: string;
  ip?: string;
  port?: number;
  slaveId: number;
  enabled: boolean;
  registers: Register[];
  lastSeen?: Date;
}

interface DeviceContextType {
  devices: Device[];
  loading: boolean;
  error: Error | null;
  fetchDevices: () => Promise<void>;
  addDevice: (device: Omit<Device, '_id'>) => Promise<void>;
  updateDevice: (device: Device) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
}

export const DeviceContext = createContext<DeviceContextType>({
  devices: [],
  loading: false,
  error: null,
  fetchDevices: async () => {},
  addDevice: async () => {},
  updateDevice: async () => {},
  deleteDevice: async () => {},
});

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDevices = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.get('/getDevices');

      // Add a lastSeen field to each device for demo purposes
      const devicesWithLastSeen = response.data.map((device: Device) => ({
        ...device,
        lastSeen: device.enabled ? new Date() : undefined,
      }));

      setDevices(devicesWithLastSeen);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch devices')
      );
    } finally {
      setLoading(false);
    }
  };

  const addDevice = async (device: Omit<Device, '_id'>) => {
    try {
      const response = await API.post('/addDevice', device);
      await fetchDevices(); // Refresh the device list
      return response.data;
    } catch (err) {
      console.error('Error adding device:', err);
      throw err instanceof Error ? err : new Error('Failed to add device');
    }
  };

  const updateDevice = async (device: Device) => {
    try {
      const response = await API.put('/updateDevice', device);

      // Update local state
      setDevices((prev) =>
        prev.map((d) => (d._id === device._id ? response.data : d))
      );

      return response.data;
    } catch (err) {
      console.error('Error updating device:', err);
      throw err instanceof Error ? err : new Error('Failed to update device');
    }
  };

  const deleteDevice = async (id: string) => {
    try {
      await API.delete(`/delete/${id}`);

      // Update local state
      setDevices((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error('Error deleting device:', err);
      throw err instanceof Error ? err : new Error('Failed to delete device');
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <DeviceContext.Provider
      value={{
        devices,
        loading,
        error,
        fetchDevices,
        addDevice,
        updateDevice,
        deleteDevice,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};
