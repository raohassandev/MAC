import React from 'react';

interface StatusCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon,
  bgColor = 'bg-white',
  textColor = 'text-gray-800',
}) => {
  return (
    <div
      className={`${bgColor} rounded-lg shadow-sm p-5 transition-all hover:shadow-md`}
    >
      <div className='flex justify-between items-start'>
        <div>
          <h3 className='text-sm font-medium text-gray-500'>{title}</h3>
          <p className={`text-2xl font-semibold mt-1 ${textColor}`}>{value}</p>
        </div>
        <div className='text-2xl'>{icon}</div>
      </div>
    </div>
  );
};

export default StatusCard;
