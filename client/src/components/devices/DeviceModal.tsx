import React, { useState } from 'react';

import { X } from 'lucide-react';

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (device: any) => void;
}

const DeviceModal: React.FC<DeviceModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [deviceData, setDeviceData] = useState({
    name: '',
    ip: '',
    port: '502',
    slaveId: '1',
    enabled: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDeviceData({
      ...deviceData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(deviceData);
    setDeviceData({
      name: '',
      ip: '',
      port: '502',
      slaveId: '1',
      enabled: true,
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md'>
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-lg font-semibold'>Add New Device</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-4'>
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='name'
            >
              Device Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={deviceData.name}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              placeholder='Enter device name'
              required
            />
          </div>

          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='ip'
            >
              IP Address
            </label>
            <input
              type='text'
              id='ip'
              name='ip'
              value={deviceData.ip}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              placeholder='192.168.1.100'
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='port'
              >
                Port
              </label>
              <input
                type='number'
                id='port'
                name='port'
                value={deviceData.port}
                onChange={handleChange}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                placeholder='502'
                required
              />
            </div>

            <div>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='slaveId'
              >
                Slave ID
              </label>
              <input
                type='number'
                id='slaveId'
                name='slaveId'
                value={deviceData.slaveId}
                onChange={handleChange}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                placeholder='1'
                required
              />
            </div>
          </div>

          <div className='mb-4'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                name='enabled'
                checked={deviceData.enabled}
                onChange={handleChange}
                className='mr-2'
              />
              <span className='text-gray-700 text-sm font-bold'>Enabled</span>
            </label>
          </div>

          <div className='flex justify-end pt-4 border-t'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              Add Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceModal;
