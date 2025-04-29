import {
  AlertCircle,
  Clock,
  Copy,
  Edit,
  Fan,
  Server,
  Tag,
  ThermometerSnowflake,
  Trash,
} from 'lucide-react';

import { Link } from 'react-router-dom';

interface CoolingProfile {
  id: string;
  name: string;
  description: string;
  targetTemperature: number;
  temperatureRange: [number, number];
  fanSpeed: number;
  mode: 'cooling' | 'heating' | 'auto' | 'dehumidify';
  schedule: {
    active: boolean;
    times: {
      days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
      startTime: string;
      endTime: string;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
  assignedDevices: string[];
  isTemplate: boolean;
  tags: string[];
}

interface ProfileCardProps {
  profile: CoolingProfile;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const ProfileCard = ({
  profile,
  onEdit,
  onDelete,
  onDuplicate,
}: ProfileCardProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'cooling':
        return <ThermometerSnowflake size={16} className='text-blue-500' />;
      case 'heating':
        return <ThermometerSnowflake size={16} className='text-red-500' />;
      case 'auto':
        return <ThermometerSnowflake size={16} className='text-green-500' />;
      case 'dehumidify':
        return <ThermometerSnowflake size={16} className='text-purple-500' />;
      default:
        return <ThermometerSnowflake size={16} className='text-gray-500' />;
    }
  };

  const getModeBgColor = (mode: string) => {
    switch (mode) {
      case 'cooling':
        return 'bg-blue-100';
      case 'heating':
        return 'bg-red-100';
      case 'auto':
        return 'bg-green-100';
      case 'dehumidify':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getModeTextColor = (mode: string) => {
    switch (mode) {
      case 'cooling':
        return 'text-blue-800';
      case 'heating':
        return 'text-red-800';
      case 'auto':
        return 'text-green-800';
      case 'dehumidify':
        return 'text-purple-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow'>
      {/* Card Header */}
      <div className='p-4 border-b border-gray-100'>
        <div className='flex justify-between items-start'>
          <h3
            className='font-semibold text-lg text-gray-800 truncate'
            title={profile.name}
          >
            {profile.name}
          </h3>
          <div className='flex space-x-1'>
            {profile.isTemplate && (
              <span className='bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full'>
                Template
              </span>
            )}
            <span
              className={`${getModeBgColor(profile.mode)} ${getModeTextColor(
                profile.mode
              )} text-xs px-2 py-0.5 rounded-full flex items-center`}
            >
              {getModeIcon(profile.mode)}
              <span className='ml-1 capitalize'>{profile.mode}</span>
            </span>
          </div>
        </div>
        <p
          className='text-sm text-gray-500 mt-1 line-clamp-2'
          title={profile.description}
        >
          {profile.description}
        </p>
      </div>

      {/* Card Body */}
      <div className='p-4'>
        {/* Temperature Settings */}
        <div className='flex justify-between mb-3'>
          <div className='flex items-center'>
            <ThermometerSnowflake size={16} className='text-blue-500 mr-2' />
            <span className='text-sm font-medium'>Target Temperature</span>
          </div>
          <span className='text-sm font-bold'>
            {profile?.targetTemperature || 'N/A'}°C
          </span>
        </div>

        <div className='flex justify-between mb-3'>
          <div className='flex items-center'>
            <AlertCircle size={16} className='text-amber-500 mr-2' />
            <span className='text-sm font-medium'>Temperature Range</span>
          </div>
          <span className='text-sm font-bold'>
            {profile.temperatureRange[0]}°C - {profile.temperatureRange[1]}°C
          </span>
        </div>

        {/* Fan Speed */}
        <div className='flex justify-between mb-3'>
          <div className='flex items-center'>
            <Fan size={16} className='text-gray-500 mr-2' />
            <span className='text-sm font-medium'>Fan Speed</span>
          </div>
          <span className='text-sm font-bold'>{profile.fanSpeed}%</span>
        </div>

        {/* Schedule */}
        <div className='flex justify-between mb-3'>
          <div className='flex items-center'>
            <Clock size={16} className='text-indigo-500 mr-2' />
            <span className='text-sm font-medium'>Schedule</span>
          </div>
          <span
            className={`text-sm font-bold ${
              profile.schedule.active ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {profile.schedule.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Assigned Devices */}
        <div className='flex justify-between mb-3'>
          <div className='flex items-center'>
            <Server size={16} className='text-gray-500 mr-2' />
            <span className='text-sm font-medium'>Assigned Devices</span>
          </div>
          <span className='text-sm font-bold'>
            {profile.assignedDevices.length}
          </span>
        </div>
      </div>

      {/* Tags */}
      {profile.tags.length > 0 && (
        <div className='px-4 pb-2'>
          <div className='flex items-center flex-wrap gap-1'>
            <Tag size={14} className='text-gray-400 mr-1' />
            {profile.tags.map((tag, index) => (
              <span
                key={index}
                className='bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Card Footer */}
      <div className='border-t border-gray-100 p-3 bg-gray-50 flex justify-between'>
        <div className='text-xs text-gray-500'>
          Updated {formatDate(profile.updatedAt)}
        </div>
        <div className='flex items-center space-x-3'>
          <button
            onClick={onDuplicate}
            className='text-indigo-500 hover:text-indigo-700'
            title='Duplicate Profile'
          >
            <Copy size={16} />
          </button>

          <Link
            to={`/profiles/${profile.id}`}
            className='text-blue-500 hover:text-blue-700'
            title='Edit Profile'
          >
            <Edit size={16} />
          </Link>

          <button
            onClick={onDelete}
            className='text-red-500 hover:text-red-700'
            title='Delete Profile'
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
