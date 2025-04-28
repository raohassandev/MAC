import {
  Clock,
  Copy,
  Edit,
  Filter,
  Plus,
  Search,
  Tag,
  ThermometerSnowflake,
  Trash,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import ProfileCard from '../components/profiles/ProfileCard';

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

const ProfileManagement = () => {
  const [profiles, setProfiles] = useState<CoolingProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<CoolingProfile[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplatesOnly, setShowTemplatesOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch profiles
    setTimeout(() => {
      const dummyProfiles: CoolingProfile[] = [
        {
          id: '1',
          name: 'Server Room Standard',
          description: 'Standard cooling profile for server rooms',
          targetTemperature: 21,
          temperatureRange: [19, 23],
          fanSpeed: 70,
          mode: 'cooling',
          schedule: {
            active: true,
            times: [
              {
                days: ['mon', 'tue', 'wed', 'thu', 'fri'],
                startTime: '09:00',
                endTime: '18:00',
              },
            ],
          },
          createdAt: new Date('2023-09-15'),
          updatedAt: new Date('2023-12-20'),
          assignedDevices: ['device1', 'device2'],
          isTemplate: true,
          tags: ['server room', 'production'],
        },
        {
          id: '2',
          name: 'Office Hours',
          description: 'Comfortable temperature during work hours',
          targetTemperature: 23,
          temperatureRange: [21, 25],
          fanSpeed: 50,
          mode: 'auto',
          schedule: {
            active: true,
            times: [
              {
                days: ['mon', 'tue', 'wed', 'thu', 'fri'],
                startTime: '08:00',
                endTime: '18:00',
              },
            ],
          },
          createdAt: new Date('2023-10-05'),
          updatedAt: new Date('2023-12-15'),
          assignedDevices: ['device3'],
          isTemplate: false,
          tags: ['office', 'comfort'],
        },
        {
          id: '3',
          name: 'Night Mode',
          description: 'Energy saving profile for non-working hours',
          targetTemperature: 26,
          temperatureRange: [24, 28],
          fanSpeed: 30,
          mode: 'cooling',
          schedule: {
            active: true,
            times: [
              {
                days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
                startTime: '20:00',
                endTime: '06:00',
              },
            ],
          },
          createdAt: new Date('2023-11-10'),
          updatedAt: new Date('2023-12-10'),
          assignedDevices: ['device1', 'device3'],
          isTemplate: false,
          tags: ['night', 'energy saving'],
        },
        {
          id: '4',
          name: 'Data Center Critical',
          description: 'Strict cooling for mission-critical data centers',
          targetTemperature: 18,
          temperatureRange: [17, 19],
          fanSpeed: 90,
          mode: 'cooling',
          schedule: {
            active: false,
            times: [],
          },
          createdAt: new Date('2023-08-20'),
          updatedAt: new Date('2023-12-05'),
          assignedDevices: [],
          isTemplate: true,
          tags: ['data center', 'critical', 'high priority'],
        },
      ];

      setProfiles(dummyProfiles);
      setFilteredProfiles(dummyProfiles);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters when search query or template filter changes
  useEffect(() => {
    if (!profiles) return;

    let filtered = [...profiles];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (profile) =>
          profile.name.toLowerCase().includes(query) ||
          profile.description.toLowerCase().includes(query) ||
          profile.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply template filter
    if (showTemplatesOnly) {
      filtered = filtered.filter((profile) => profile.isTemplate);
    }

    setFilteredProfiles(filtered);
  }, [searchQuery, showTemplatesOnly, profiles]);

  const handleDeleteProfile = (id: string) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      // In a real app, you would call an API here
      setProfiles(profiles.filter((profile) => profile.id !== id));
      setFilteredProfiles(
        filteredProfiles.filter((profile) => profile.id !== id)
      );
    }
  };

  const handleDuplicateProfile = (profile: CoolingProfile) => {
    const newProfile = {
      ...profile,
      id: `${Date.now()}`, // Generate a temporary ID
      name: `${profile.name} (Copy)`,
      isTemplate: false,
      assignedDevices: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProfiles([...profiles, newProfile]);
    setFilteredProfiles([...filteredProfiles, newProfile]);
  };

  if (loading) {
    return (
      <div className='animate-pulse p-8 text-center text-gray-500'>
        <ThermometerSnowflake className='mx-auto mb-4' size={32} />
        <p>Loading cooling profiles...</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Cooling Profiles</h1>
        <Link
          to='/profiles/new'
          className='flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md'
        >
          <Plus size={16} />
          Create Profile
        </Link>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow-sm p-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='relative flex-grow'>
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

          <div className='flex items-center'>
            <label className='inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={showTemplatesOnly}
                onChange={(e) => setShowTemplatesOnly(e.target.checked)}
                className='sr-only'
              />
              <div
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showTemplatesOnly ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showTemplatesOnly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
              <span className='ml-2 text-sm text-gray-700'>
                Show templates only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Profile Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredProfiles.length === 0 ? (
          <div className='col-span-full bg-gray-50 p-8 rounded-lg text-center'>
            <ThermometerSnowflake
              className='mx-auto mb-3 text-gray-400'
              size={30}
            />
            <p className='text-gray-500 mb-2'>No profiles found</p>
            <p className='text-sm text-gray-500'>
              {searchQuery || showTemplatesOnly
                ? 'Try adjusting your search or filters'
                : 'Create a new cooling profile to get started'}
            </p>
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onEdit={() => {}}
              onDelete={() => handleDeleteProfile(profile.id)}
              onDuplicate={() => handleDuplicateProfile(profile)}
            />
          ))
        )}
      </div>

      {/* Profile Tags Section */}
      <div className='bg-white rounded-lg shadow-sm p-5'>
        <h2 className='text-lg font-semibold mb-4 flex items-center'>
          <Tag className='mr-2 text-indigo-500' size={18} />
          Popular Tags
        </h2>
        <div className='flex flex-wrap gap-2'>
          {Array.from(new Set(profiles.flatMap((profile) => profile.tags)))
            .filter((tag) => tag) // Filter out empty tags
            .map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className='bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full'
              >
                {tag}
              </button>
            ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-indigo-50 rounded-lg p-4'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-xs text-indigo-600 font-medium'>
                Total Profiles
              </p>
              <p className='text-2xl font-bold text-indigo-700'>
                {profiles.length}
              </p>
            </div>
            <ThermometerSnowflake className='text-indigo-500' size={20} />
          </div>
        </div>

        <div className='bg-green-50 rounded-lg p-4'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-xs text-green-600 font-medium'>
                Active Profiles
              </p>
              <p className='text-2xl font-bold text-green-700'>
                {profiles.filter((p) => p.assignedDevices.length > 0).length}
              </p>
            </div>
            <Clock className='text-green-500' size={20} />
          </div>
        </div>

        <div className='bg-purple-50 rounded-lg p-4'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-xs text-purple-600 font-medium'>
                Template Profiles
              </p>
              <p className='text-2xl font-bold text-purple-700'>
                {profiles.filter((p) => p.isTemplate).length}
              </p>
            </div>
            <Copy className='text-purple-500' size={20} />
          </div>
        </div>

        <div className='bg-blue-50 rounded-lg p-4'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-xs text-blue-600 font-medium'>
                Scheduled Profiles
              </p>
              <p className='text-2xl font-bold text-blue-700'>
                {profiles.filter((p) => p.schedule.active).length}
              </p>
            </div>
            <Clock className='text-blue-500' size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
