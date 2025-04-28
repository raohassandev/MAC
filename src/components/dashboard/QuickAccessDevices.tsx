import { AlertCircle, CheckCircle, HardDrive } from 'lucide-react';

import { Link } from 'react-router-dom';

interface Device {
  _id: string;
  name: string;
  ip?: string;
  port?: number;
  enabled: boolean;
  lastSeen?: Date;
}

interface QuickAccessDevicesProps {
  devices: Device[];
}

const QuickAccessDevices = ({ devices }: QuickAccessDevicesProps) => {
  if (!devices || devices.length === 0) {
    return (
      <div className='text-center py-8 text-gray-500'>
        <HardDrive className='mx-auto mb-2' size={24} />
        <p>No devices found</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {devices.map((device) => (
        <Link
          key={device._id}
          to={`/devices/${device._id}`}
          className='flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors border border-gray-100'
        >
          <div className='mr-3'>
            {device.enabled ? (
              <CheckCircle size={18} className='text-green-500' />
            ) : (
              <AlertCircle size={18} className='text-red-500' />
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-medium text-gray-800 truncate'>{device.name}</p>
            <p className='text-xs text-gray-500 truncate'>
              {device.ip ? `${device.ip}:${device.port}` : 'No connection info'}
            </p>
          </div>
          <div className='text-xs text-gray-400'>
            {device.lastSeen
              ? `Last seen: ${new Date(device.lastSeen).toLocaleTimeString()}`
              : 'Never connected'}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickAccessDevices;
