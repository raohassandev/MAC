import { Edit, HardDrive, Plus, Search, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import DeviceModal from '../components/devices/DeviceModal';

interface Device {
  id: string;
  name: string;
  ip: string;
  port: number;
  slaveId: number;
  enabled: boolean;
  lastSeen?: string;
}

const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock API call - in a real app, you would fetch from your backend
    const fetchDevices = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Sample data
        const sampleDevices: Device[] = [
          {
            id: '1',
            name: 'Server Room Cooler',
            ip: '192.168.1.100',
            port: 502,
            slaveId: 1,
            enabled: true,
            lastSeen: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Office AC Unit',
            ip: '192.168.1.101',
            port: 502,
            slaveId: 2,
            enabled: false,
            lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          },
        ];

        setDevices(sampleDevices);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const handleAddDevice = (newDevice: any) => {
    const deviceWithId = {
      ...newDevice,
      id: Date.now().toString(),
      port: parseInt(newDevice.port),
      slaveId: parseInt(newDevice.slaveId),
      lastSeen: newDevice.enabled ? new Date().toISOString() : undefined,
    };

    setDevices([...devices, deviceWithId]);
    setIsModalOpen(false);
  };

  const handleDeleteDevice = (id: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      setDevices(devices.filter((device) => device.id !== id));
    }
  };

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.ip.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Device Management</h1>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2'
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Add New Device
        </button>
      </div>

      <div className='bg-white shadow rounded-lg p-4 mb-6'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <Search size={16} className='text-gray-400' />
          </div>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search devices...'
            className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className='bg-white shadow rounded-lg overflow-hidden'>
        {isLoading ? (
          <div className='animate-pulse p-8 text-center text-gray-500'>
            <HardDrive className='mx-auto mb-4' size={32} />
            <p>Loading devices...</p>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            <HardDrive className='mx-auto mb-4' size={32} />
            <p className='mb-2'>No devices found</p>
            <p className='text-sm'>
              {searchQuery
                ? 'Try adjusting your search'
                : 'Add your first device to get started'}
            </p>
          </div>
        ) : (
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Device Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Connection Info
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Last Seen
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredDevices.map((device) => (
                <tr key={device.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div
                        className={`mr-2 h-2.5 w-2.5 rounded-full ${
                          device.enabled ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></div>
                      <div className='text-sm font-medium text-gray-900'>
                        {device.name}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {device.ip}:{device.port} (Slave ID: {device.slaveId})
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        device.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {device.enabled ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {formatDate(device.lastSeen)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <button className='text-indigo-600 hover:text-indigo-900 mr-3'>
                      <Edit size={16} />
                    </button>
                    <button
                      className='text-red-600 hover:text-red-900'
                      onClick={() => handleDeleteDevice(device.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddDevice}
      />
    </div>
  );
};

export default DeviceManagement;
