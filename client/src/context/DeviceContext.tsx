import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import API from '../services/api';
import { Device } from '../types/device.types';

interface Register {
  name: string;
  address: number;
  length: number;
  functionCode?: number;
  scaleFactor?: number;
  decimalPoint?: number;
  byteOrder?: string;
  unit?: string;
}

interface DeviceContextType {
  devices: Device[];
  loading: boolean;
  error: Error | null;
  fetchDevices: () => Promise<void>;
  addDevice: (device: Omit<Device, '_id'>) => Promise<void>;
  updateDevice: (device: Device) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
  testConnection: (
    id: string
  ) => Promise<{ success: boolean; message: string }>;
  readRegisters: (id: string) => Promise<any>;
}

export const DeviceContext = createContext<DeviceContextType>({
  devices: [],
  loading: false,
  error: null,
  fetchDevices: async () => {},
  addDevice: async () => {},
  updateDevice: async () => {},
  deleteDevice: async () => {},
  testConnection: async () => ({ success: false, message: '' }),
  readRegisters: async () => ({}),
});

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Attempt to fetch from the actual API
      let response;
      try {
        response = await API.get('/devices');
      } catch (apiError) {
        // If that fails, try the backwards compatibility endpoint
        response = await API.get('/getDevices');
      }

      // Process the response data to ensure all required fields
      const formattedDevices = response.data.map((device: Device) => ({
        ...device,
        tags: device.tags || [],
        registers: device.registers || [],
        lastSeen: device.enabled ? device.lastSeen || new Date() : undefined,
      }));

      setDevices(formattedDevices);
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

  const addDevice = async (device: Omit<Device, '_id'>) => {
    try {
      // Ensure required fields
      const deviceToAdd = {
        ...device,
        tags: device.tags || [],
        registers: device.registers || [],
      };

      // Try posting to the actual API first
      let response;
      try {
        response = await API.post('/devices', deviceToAdd);
      } catch (apiError) {
        // If that fails, try the backwards compatibility endpoint
        response = await API.post('/addDevice', deviceToAdd);
      }

      // Update local state with new device
      setDevices((prevDevices) => [...prevDevices, response.data]);

      return response.data;
    } catch (err) {
      console.error('Error adding device:', err);
      throw err instanceof Error ? err : new Error('Failed to add device');
    }
  };

  const updateDevice = async (device: Device) => {
    try {
      // Ensure required fields
      const deviceToUpdate = {
        ...device,
        tags: device.tags || [],
        registers: device.registers || [],
      };

      // Try the standard API endpoint first
      let response;
      try {
        response = await API.put(`/devices/${device._id}`, deviceToUpdate);
      } catch (apiError) {
        // If that fails, try the backwards compatibility endpoint
        response = await API.put(`/updateDevice/${device._id}`, deviceToUpdate);
      }

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
      // Try the standard API endpoint first
      try {
        await API.delete(`/devices/${id}`);
      } catch (apiError) {
        // If that fails, try the backwards compatibility endpoint
        await API.delete(`/deleteDevice/${id}`);
      }

      // Update local state
      setDevices((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error('Error deleting device:', err);
      throw err instanceof Error ? err : new Error('Failed to delete device');
    }
  };

  const testConnection = async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await API.post(`/devices/${id}/test`);

      // If successful, update the device's lastSeen timestamp in local state
      if (response.data.success) {
        setDevices((prev) =>
          prev.map((d) => {
            if (d._id === id) {
              return {
                ...d,
                lastSeen: new Date(),
              };
            }
            return d;
          })
        );
      }

      return response.data;
    } catch (err) {
      console.error('Error testing device connection:', err);
      return {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : 'Failed to test device connection',
      };
    }
  };

  const readRegisters = async (id: string): Promise<any> => {
    try {
      const response = await API.get(`/devices/${id}/read`);

      // Update the device's lastSeen timestamp in local state
      setDevices((prev) =>
        prev.map((d) => {
          if (d._id === id) {
            return {
              ...d,
              lastSeen: new Date(),
            };
          }
          return d;
        })
      );

      return response.data;
    } catch (err) {
      console.error('Error reading device registers:', err);
      throw err instanceof Error
        ? err
        : new Error('Failed to read device registers');
    }
  };

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
        testConnection,
        readRegisters,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

// Custom hook to use the DeviceContext
export const useDevices = () => {
  const context = React.useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
};
