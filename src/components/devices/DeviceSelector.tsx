import { AlertCircle, Check, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useDevices } from '../../hooks/useDevices';

interface Device {
  _id: string;
  name: string;
  ip?: string;
  port?: number;
  enabled: boolean;
}

interface DeviceSelectorProps {
  selectedDevices: string[];
  onChange: (deviceIds: string[]) => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  selectedDevices,
  onChange,
}) => {
  const { devices, loading, error } = useDevices();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);

  // Filter devices based on search query
  useEffect(() => {
    if (!devices) return;

    const filtered = devices.filter(
      (device) =>
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.ip?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredDevices(filtered);
  }, [devices, searchQuery]);

  const handleToggleDevice = (deviceId: string) => {
    const isSelected = selectedDevices.includes(deviceId);

    if (isSelected) {
      onChange(selectedDevices.filter((id) => id !== deviceId));
    } else {
      onChange([...selectedDevices, deviceId]);
    }
  };

  const handleSelectAll = () => {
    if (!devices) return;

    const allDeviceIds = devices.map((device) => device._id);
    onChange(allDeviceIds);
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  if (loading) {
    return (
      <div className='p-4 text-center text-gray-500 animate-pulse'>
        Loading devices...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center p-4 text-red-600 bg-red-50 rounded-lg'>
        <AlertCircle size={18} className='mr-2' />
        <span>Error loading devices: {error.message}</span>
      </div>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <div className='p-4 text-center text-gray-500 bg-gray-50 rounded-lg'>
        <p>No devices available to assign to this profile.</p>
        <p className='text-sm mt-1'>
          You need to add devices before you can assign them to profiles.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Search and Actions */}
      <div className='flex flex-col md:flex-row gap-3 items-center'>
        <div className='relative flex-grow'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <Search size={16} className='text-gray-400' />
          </div>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search devices...'
            className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        <div className='flex space-x-2'>
          <button
            type='button'
            onClick={handleSelectAll}
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            Select All
          </button>
          <button
            type='button'
            onClick={handleDeselectAll}
            className='text-sm text-gray-600 hover:text-gray-800'
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className='text-sm text-gray-600'>
        Selected {selectedDevices.length} of {devices.length} devices
      </div>

      {/* Device List */}
      <div className='border border-gray-200 rounded-md overflow-hidden max-h-64 overflow-y-auto'>
        {filteredDevices.length === 0 ? (
          <div className='p-4 text-center text-gray-500 bg-gray-50'>
            <p>No devices match your search.</p>
          </div>
        ) : (
          <ul className='divide-y divide-gray-200'>
            {filteredDevices.map((device) => {
              const isSelected = selectedDevices.includes(device._id);

              return (
                <li
                  key={device._id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleToggleDevice(device._id)}
                >
                  <div className='flex items-center'>
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <Check size={14} className='text-white' />}
                    </div>

                    <div className='ml-3 flex-grow'>
                      <div className='flex items-center'>
                        <div
                          className={`mr-2 h-2 w-2 rounded-full ${
                            device.enabled ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span className='font-medium text-gray-800'>
                          {device.name}
                        </span>
                      </div>
                      {device.ip && (
                        <p className='text-xs text-gray-500'>
                          {device.ip}:{device.port}
                        </p>
                      )}
                    </div>

                    <div className='text-xs text-gray-500'>
                      {device.enabled ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selectedDevices.length > 0 && (
        <div className='bg-blue-50 p-3 rounded-lg'>
          <h4 className='text-sm font-medium text-blue-800 mb-1'>
            Selected Devices
          </h4>
          <div className='flex flex-wrap gap-2'>
            {selectedDevices.map((id) => {
              const device = devices.find((d) => d._id === id);
              if (!device) return null;

              return (
                <div
                  key={id}
                  className='bg-white border border-blue-200 rounded-full px-3 py-1 text-xs text-blue-600 flex items-center'
                >
                  {device.name}
                  <button
                    type='button'
                    className='ml-1 text-blue-400 hover:text-blue-600'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleDevice(id);
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className='text-sm text-gray-500'>
        Assign devices to apply this cooling profile to them. The profile
        settings will be applied to all selected devices.
      </p>
    </div>
  );
};

export default DeviceSelector;
