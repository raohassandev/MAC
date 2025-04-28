import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ThermometerSnowflake,
  ArrowLeft,
  Save,
  Trash,
  Clock,
  Tag,
  Plus,
  X,
  AlertTriangle,
  Server
} from 'lucide-react';
import ScheduleEditor from '../components/profiles/ScheduleEditor';
import DeviceSelector from '../components/devices/DeviceSelector';

interface Schedule {
  active: boolean;
  times: {
    id: string;
    days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
    startTime: string;
    endTime: string;
  }[];
}

interface CoolingProfile {
  id?: string;
  name: string;
  description: string;
  targetTemperature: number;
  temperatureRange: [number, number];
  fanSpeed: number;
  mode: 'cooling' | 'heating' | 'auto' | 'dehumidify';
  schedule: Schedule;
  createdAt?: Date;
  updatedAt?: Date;
  assignedDevices: string[];
  isTemplate: boolean;
  tags: string[];
}

const ProfileEditor = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const isEditMode = !!profileId && profileId !== 'new';
  
  const [profile, setProfile] = useState<CoolingProfile>({
    name: '',
    description: '',
    targetTemperature: 22,
    temperatureRange: [20, 24],
    fanSpeed: 50,
    mode: 'cooling',
    schedule: {
      active: false,
      times: []
    },
    assignedDevices: [],
    isTemplate: false,
    tags: []
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      // In a real app, you would fetch the profile from an API
      setTimeout(() => {
        // Sample data for demonstration
        const sampleProfile: CoolingProfile = {
          id: profileId,
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
                id: '1',
                days: ['mon', 'tue', 'wed', 'thu', 'fri'],
                startTime: '09:00',
                endTime: '18:00'
              }
            ]
          },
          createdAt: new Date('2023-09-15'),
          updatedAt: new Date('2023-12-20'),
          assignedDevices: ['device1', 'device2'],
          isTemplate: true,
          tags: ['server room', 'production']
        };
        
        setProfile(sampleProfile);
        setLoading(false);
      }, 1000);
    }
  }, [profileId, isEditMode]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!profile.name.trim()) {
      newErrors.name = 'Profile name is required';
    }
    
    if (profile.targetTemperature < 15 || profile.targetTemperature > 30) {
      newErrors.targetTemperature = 'Temperature must be between 15°C and 30°C';
    }
    
    if (profile.temperatureRange[0] >= profile.temperatureRange[1]) {
      newErrors.temperatureRange = 'Min temperature must be less than max temperature';
    }
    
    if (profile.fanSpeed < 0 || profile.fanSpeed > 100) {
      newErrors.fanSpeed = 'Fan speed must be between 0% and 100%';
    }
    
    // Validate schedule if active
    if (profile.schedule.active && profile.schedule.times.length === 0) {
      newErrors.schedule = 'At least one schedule time must be added when schedule is active';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }
    
    // In a real app, you would save the profile to an API
    console.log('Saving profile:', profile);
    
    // Navigate back to the profiles list
    navigate('/profiles');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleRangeChange = (index: number, value: number) => {
    setProfile(prev => {
      const newRange = [...prev.temperatureRange] as [number, number];
      newRange[index] = value;
      return {
        ...prev,
        temperatureRange: newRange
      };
    });
    
    // Clear error
    if (errors.temperatureRange) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.temperatureRange;
        return newErrors;
      });
    }
  };
  
  const handleScheduleChange = (schedule: Schedule) => {
    setProfile(prev => ({
      ...prev,
      schedule
    }));
    
    // Clear error
    if (errors.schedule) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.schedule;
        return newErrors;
      });
    }
  };
  
  const handleDevicesChange = (deviceIds: string[]) => {
    setProfile(prev => ({
      ...prev,
      assignedDevices: deviceIds
    }));
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !profile.tags.includes(newTag.trim())) {
      setProfile(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setProfile(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  if (loading) {
    return (
      <div className="animate-pulse p-8 text-center text-gray-500">
        <ThermometerSnowflake className="mx-auto mb-4" size={32} />
        <p>Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/profiles" className="flex items-center text-blue-500 hover:text-blue-700 mb-2">
            <ArrowLeft size={16} className="mr-1" />
            Back to profiles
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Profile' : 'Create New Profile'}
          </h1>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Save size={16} />
            Save Profile
          </button>
          
          {isEditMode && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this profile?')) {
                  // Delete logic would go here
                  navigate('/profiles');
                }
              }}
              className="flex items-center gap-1 px-4 py-2 bg-white border border-red-300 text-red-600 rounded-md hover:bg-red-50"
            >
              <Trash size={16} />
              Delete
            </button>
          )}
        </div>
      </div>
      
      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Please fix the following errors:</h3>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="E.g., Server Room Cooling"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={profile.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the purpose and usage of this profile"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isTemplate"
                name="isTemplate"
                checked={profile.isTemplate}
                onChange={(e) => {
                  setProfile(prev => ({
                    ...prev,
                    isTemplate: e.target.checked
                  }));
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isTemplate" className="ml-2 block text-sm text-gray-700">
                Save as template
              </label>
              <div className="ml-2 text-xs text-gray-500">
                (Templates can be reused but are not assigned to devices)
              </div>
            </div>
          </div>
        </div>
        
        {/* Temperature Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <ThermometerSnowflake className="mr-2 text-blue-500" size={20} />
            Temperature Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
                Operation Mode
              </label>
              <select
                id="mode"
                name="mode"
                value={profile.mode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cooling">Cooling</option>
                <option value="heating">Heating</option>
                <option value="auto">Auto</option>
                <option value="dehumidify">Dehumidify</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="targetTemperature" className="block text-sm font-medium text-gray-700 mb-1">
                Target Temperature (°C)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="targetTemperature"
                  name="targetTemperature"
                  min="15"
                  max="30"
                  step="0.5"
                  value={profile.targetTemperature}
                  onChange={handleInputChange}
                  className={`w-full ${errors.targetTemperature ? 'accent-red-500' : 'accent-blue-500'}`}
                />
                <span className="ml-2 w-12 text-center font-medium">
                  {profile.targetTemperature}°C
                </span>
              </div>
              {errors.targetTemperature && (
                <p className="mt-1 text-sm text-red-600">{errors.targetTemperature}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature Range (°C)
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-10 text-sm text-gray-500">Min:</span>
                  <input
                    type="range"
                    min="15"
                    max="29"
                    step="0.5"
                    value={profile.temperatureRange[0]}
                    onChange={(e) => handleRangeChange(0, parseFloat(e.target.value))}
                    className={`w-full ${errors.temperatureRange ? 'accent-red-500' : 'accent-blue-500'}`}
                  />
                  <span className="ml-2 w-12 text-center font-medium">
                    {profile.temperatureRange[0]}°C
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-10 text-sm text-gray-500">Max:</span>
                  <input
                    type="range"
                    min="16"
                    max="30"
                    step="0.5"
                    value={profile.temperatureRange[1]}
                    onChange={(e) => handleRangeChange(1, parseFloat(e.target.value))}
                    className={`w-full ${errors.temperatureRange ? 'accent-red-500' : 'accent-blue-500'}`}
                  />
                  <span className="ml-2 w-12 text-center font-medium"></span>