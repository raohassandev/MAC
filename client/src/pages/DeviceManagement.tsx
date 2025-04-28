import { HardDrive, Plus, Search } from 'lucide-react';
import React, { useState } from 'react';

const DeviceManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Device Management</h1>
        <button className='flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md'>
          <Plus size={16} />
          Add Device
        </button>
      </div>

      {/* Search Bar */}
      <div className='bg-white rounded-lg shadow-sm p-4'>
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

      {/* Devices Table/List */}
      <div className='bg-white rounded-lg shadow-sm p-6 min-h-[300px] flex items-center justify-center'>
        {isLoading ? (
          <div className='animate-pulse text-gray-500'>Loading devices...</div>
        ) : (
          <div className='text-center'>
            <HardDrive size={48} className='mx-auto mb-4 text-gray-400' />
            <h3 className='text-lg font-medium text-gray-700'>
              No devices found
            </h3>
            <p className='text-gray-500 mt-2'>
              Get started by adding your first device
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceManagement;
