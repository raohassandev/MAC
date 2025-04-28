import React from 'react';

interface DeviceStatusCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  detail?: string;
}

const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({
  title,
  value,
  icon,
  detail,
}) => {
  return (
    <div className='bg-white rounded-lg shadow-sm p-5 transition-all hover:shadow-md'>
      <div className='flex justify-between'>
        <div>
          <h3 className='text-sm font-medium text-gray-500'>{title}</h3>
          <p className='text-2xl font-semibold mt-1'>{value}</p>
          {detail && <p className='text-xs text-gray-500 mt-1'>{detail}</p>}
        </div>
        <div className='text-2xl'>{icon}</div>
      </div>
    </div>
  );
};

export default DeviceStatusCard;
