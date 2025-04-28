import { AlertCircle, CheckCircle, HardDrive, Thermometer } from 'lucide-react';

import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>System Dashboard</h1>
        <div className='text-sm text-gray-500'>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Status Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatusCard
          title='Total Devices'
          value='0'
          icon={<HardDrive className='text-blue-500' />}
        />
        <StatusCard
          title='Online Devices'
          value='0'
          icon={<CheckCircle className='text-green-500' />}
        />
        <StatusCard
          title='Offline Devices'
          value='0'
          icon={<AlertCircle className='text-orange-500' />}
        />
        <StatusCard
          title='Temperature'
          value='--°C'
          icon={<Thermometer className='text-red-500' />}
        />
      </div>

      {/* Main Content Area */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h2 className='text-lg font-semibold mb-4'>Welcome to MacSys</h2>
        <p className='text-gray-600'>
          This is your dashboard for managing Modbus devices. Use the navigation
          menu on the left to explore the application features.
        </p>

        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer'>
            <h3 className='font-medium text-indigo-600 flex items-center'>
              <HardDrive size={18} className='mr-2' />
              Device Management
            </h3>
            <p className='mt-2 text-sm text-gray-600'>
              Add, configure, and monitor your Modbus devices
            </p>
          </div>

          <div className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer'>
            <h3 className='font-medium text-indigo-600 flex items-center'>
              <Thermometer size={18} className='mr-2' />
              Cooling Profiles
            </h3>
            <p className='mt-2 text-sm text-gray-600'>
              Create and manage temperature profiles for your devices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Status Card Component
const StatusCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className='bg-white rounded-lg shadow-sm p-5'>
    <div className='flex justify-between items-start'>
      <div>
        <h3 className='text-sm font-medium text-gray-500'>{title}</h3>
        <p className='text-2xl font-semibold mt-1'>{value}</p>
      </div>
      <div className='text-2xl'>{icon}</div>
    </div>
  </div>
);

export default Dashboard;
