import {
  Copy,
  Edit,
  Plus,
  Search,
  Tag,
  ThermometerSnowflake,
  Trash,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

interface CoolingProfile {
  id: string;
  name: string;
  description: string;
  targetTemperature: number;
  temperatureRange: [number, number];
  fanSpeed: number;
  mode: 'cooling' | 'heating' | 'auto' | 'dehumidify';
  createdAt: string;
  updatedAt: string;
}

const ProfileManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<CoolingProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock API call - in a real app, you would fetch from your backend
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Sample data
        const sampleProfiles: CoolingProfile[] = [
          {
            id: '1',
            name: 'Server Room Standard',
            description: 'Standard cooling profile for server rooms',
            targetTemperature: 21,
            temperatureRange: [19, 23],
            fanSpeed: 70,
            mode: 'cooling',
            createdAt: '2023-09-15T00:00:00.000Z',
            updatedAt: '2023-12-20T00:00:00.000Z',
          },
          {
            id: '2',
            name: 'Office Comfort',
            description: 'Comfortable settings for office areas',
            targetTemperature: 24,
            temperatureRange: [22, 26],
            fanSpeed: 40,
            mode: 'auto',
            createdAt: '2023-10-05T00:00:00.000Z',
            updatedAt: '2023-12-15T00:00:00.000Z',
          },
        ];

        setProfiles(sampleProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleDeleteProfile = (id: string) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      setProfiles(profiles.filter((profile) => profile.id !== id));
    }
  };

  const handleDuplicateProfile = (profile: CoolingProfile) => {
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
      name: `${profile.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProfiles([...profiles, newProfile]);
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'cooling':
        return 'bg-blue-100 text-blue-800';
      case 'heating':
        return 'bg-red-100 text-red-800';
      case 'auto':
        return 'bg-green-100 text-green-800';
      case 'dehumidify':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Cooling Profiles</h1>
        <Link
          to='/profiles/new'
          className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2'
        >
          <Plus size={16} />
          Create New Profile
        </Link>
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
            placeholder='Search profiles...'
            className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      {isLoading ? (
        <div className='bg-white shadow rounded-lg p-8 text-center'>
          <div className='animate-pulse'>
            <ThermometerSnowflake
              className='mx-auto mb-4 text-blue-300'
              size={36}
            />
            <p className='text-gray-500'>Loading cooling profiles...</p>
          </div>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className='bg-white shadow rounded-lg p-8 text-center'>
          <ThermometerSnowflake
            className='mx-auto mb-4 text-gray-400'
            size={36}
          />
          <p className='text-gray-700 mb-2'>No profiles found</p>
          <p className='text-sm text-gray-500'>
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Create your first cooling profile to get started'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className='bg-white shadow rounded-lg overflow-hidden'
            >
              {/* Card Header */}
              <div className='p-4 border-b border-gray-100'>
                <div className='flex justify-between items-start'>
                  <h3
                    className='font-semibold text-lg text-gray-800 truncate'
                    title={profile.name}
                  >
                    {profile.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getModeColor(
                      profile.mode
                    )}`}
                  >
                    {profile.mode.charAt(0).toUpperCase() +
                      profile.mode.slice(1)}
                  </span>
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
                    <ThermometerSnowflake
                      size={16}
                      className='text-blue-500 mr-2'
                    />
                    <span className='text-sm font-medium'>
                      Target Temperature
                    </span>
                  </div>
                  <span className='text-sm font-bold'>
                    {profile.targetTemperature}°C
                  </span>
                </div>

                <div className='flex justify-between mb-3'>
                  <div className='flex items-center'>
                    <Tag size={16} className='text-indigo-500 mr-2' />
                    <span className='text-sm font-medium'>
                      Temperature Range
                    </span>
                  </div>
                  <span className='text-sm font-bold'>
                    {profile.temperatureRange[0]}°C -{' '}
                    {profile.temperatureRange[1]}°C
                  </span>
                </div>

                {/* Fan Speed */}
                <div className='flex justify-between mb-3'>
                  <div className='flex items-center'>
                    <svg
                      className='w-4 h-4 text-gray-500 mr-2'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M12 22v-6M12 8V2M4.93 10.93l6.36-6.36M18.36 19.07l-6.36-6.36M2 12h6M16 12h6M19.07 4.93l-6.36 6.36M10.93 18.36l6.36-6.36' />
                    </svg>
                    <span className='text-sm font-medium'>Fan Speed</span>
                  </div>
                  <span className='text-sm font-bold'>{profile.fanSpeed}%</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className='border-t border-gray-100 p-3 bg-gray-50 flex justify-between'>
                <div className='text-xs text-gray-500'>
                  Updated {formatDate(profile.updatedAt)}
                </div>
                <div className='flex items-center space-x-3'>
                  <button
                    onClick={() => handleDuplicateProfile(profile)}
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
                    onClick={() => handleDeleteProfile(profile.id)}
                    className='text-red-500 hover:text-red-700'
                    title='Delete Profile'
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileManagement;
