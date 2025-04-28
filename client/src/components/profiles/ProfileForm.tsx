import { ChevronLeft, Fan, Save, ThermometerSnowflake, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

interface ProfileFormProps {
  onSave: (profile: any) => void;
  initialData?: any;
  isEdit?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  onSave,
  initialData = {
    name: '',
    description: '',
    targetTemperature: 22,
    temperatureRange: [20, 24],
    fanSpeed: 50,
    mode: 'cooling',
  },
  isEdit = false,
}) => {
  const [profileData, setProfileData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setProfileData({
      ...profileData,
      [name]: value,
    });

    // Clear the error for this field when it changes
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleRangeChange = (index: 0 | 1, value: number) => {
    const newRange = [...profileData.temperatureRange];
    newRange[index] = value;

    setProfileData({
      ...profileData,
      temperatureRange: newRange,
    });

    if (errors.temperatureRange) {
      setErrors({
        ...errors,
        temperatureRange: '',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Profile name is required';
    }

    if (
      profileData.targetTemperature < 15 ||
      profileData.targetTemperature > 30
    ) {
      newErrors.targetTemperature = 'Temperature must be between 15°C and 30°C';
    }

    if (profileData.temperatureRange[0] >= profileData.temperatureRange[1]) {
      newErrors.temperatureRange =
        'Min temperature must be less than max temperature';
    }

    if (profileData.fanSpeed < 0 || profileData.fanSpeed > 100) {
      newErrors.fanSpeed = 'Fan speed must be between 0% and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the top where errors are shown
      window.scrollTo(0, 0);
      return;
    }

    const savedProfile = {
      ...profileData,
      id: isEdit ? profileData.id : Date.now().toString(),
      createdAt: isEdit ? profileData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(savedProfile);
    navigate('/profiles');
  };

  return (
    <div>
      <div className='mb-6'>
        <Link
          to='/profiles'
          className='text-blue-500 hover:text-blue-700 flex items-center gap-1'
        >
          <ChevronLeft size={16} />
          Back to Profiles
        </Link>
        <h1 className='text-2xl font-bold text-gray-800 mt-2'>
          {isEdit ? 'Edit Profile' : 'Create New Profile'}
        </h1>
      </div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className='bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <X className='h-5 w-5 text-red-400' aria-hidden='true' />
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-red-800'>
                There were {Object.keys(errors).length} errors with your
                submission
              </h3>
              <div className='mt-2 text-sm text-red-700'>
                <ul className='list-disc pl-5 space-y-1'>
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Basic Information */}
        <div className='bg-white shadow rounded-lg p-6'>
          <h2 className='text-lg font-semibold mb-4'>Basic Information</h2>

          <div className='space-y-4'>
            <div>
              <label
                className='block text-sm font-medium text-gray-700 mb-1'
                htmlFor='name'
              >
                Profile Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={profileData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder='E.g., Server Room Cooling'
              />
              {errors.name && (
                <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
              )}
            </div>

            <div>
              <label
                className='block text-sm font-medium text-gray-700 mb-1'
                htmlFor='description'
              >
                Description
              </label>
              <textarea
                id='description'
                name='description'
                value={profileData.description}
                onChange={handleChange}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                placeholder='Describe the purpose and usage of this profile'
              />
            </div>
          </div>
        </div>

        {/* Temperature Settings */}
        <div className='bg-white shadow rounded-lg p-6'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <ThermometerSnowflake className='mr-2 text-blue-500' size={20} />
            Temperature Settings
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label
                htmlFor='mode'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Operation Mode
              </label>
              <select
                id='mode'
                name='mode'
                value={profileData.mode}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='cooling'>Cooling</option>
                <option value='heating'>Heating</option>
                <option value='auto'>Auto</option>
                <option value='dehumidify'>Dehumidify</option>
              </select>
            </div>

            <div>
              <label
                htmlFor='targetTemperature'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Target Temperature (°C)
              </label>
              <div className='flex items-center'>
                <input
                  type='range'
                  id='targetTemperature'
                  name='targetTemperature'
                  min='15'
                  max='30'
                  step='0.5'
                  value={profileData.targetTemperature}
                  onChange={handleChange}
                  className={`w-full ${
                    errors.targetTemperature
                      ? 'accent-red-500'
                      : 'accent-blue-500'
                  }`}
                />
                <span className='ml-2 w-12 text-center font-medium'>
                  {profileData.targetTemperature}°C
                </span>
              </div>
              {errors.targetTemperature && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.targetTemperature}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Temperature Range (°C)
              </label>
              <div className='space-y-2'>
                <div className='flex items-center'>
                  <span className='w-10 text-sm text-gray-500'>Min:</span>
                  <input
                    type='range'
                    min='15'
                    max='29'
                    step='0.5'
                    value={profileData.temperatureRange[0]}
                    onChange={(e) =>
                      handleRangeChange(0, parseFloat(e.target.value))
                    }
                    className={`w-full ${
                      errors.temperatureRange
                        ? 'accent-red-500'
                        : 'accent-blue-500'
                    }`}
                  />
                  <span className='ml-2 w-12 text-center font-medium'>
                    {profileData.temperatureRange[0]}°C
                  </span>
                </div>
                <div className='flex items-center'>
                  <span className='w-10 text-sm text-gray-500'>Max:</span>
                  <input
                    type='range'
                    min='16'
                    max='30'
                    step='0.5'
                    value={profileData.temperatureRange[1]}
                    onChange={(e) =>
                      handleRangeChange(1, parseFloat(e.target.value))
                    }
                    className={`w-full ${
                      errors.temperatureRange
                        ? 'accent-red-500'
                        : 'accent-blue-500'
                    }`}
                  />
                  <span className='ml-2 w-12 text-center font-medium'>
                    {profileData.temperatureRange[1]}°C
                  </span>
                </div>
              </div>
              {errors.temperatureRange && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.temperatureRange}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='fanSpeed'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                <span className='flex items-center'>
                  <Fan size={16} className='mr-1' />
                  Fan Speed (%)
                </span>
              </label>
              <div className='flex items-center'>
                <input
                  type='range'
                  id='fanSpeed'
                  name='fanSpeed'
                  min='0'
                  max='100'
                  step='5'
                  value={profileData.fanSpeed}
                  onChange={handleChange}
                  className={`w-full ${
                    errors.fanSpeed ? 'accent-red-500' : 'accent-blue-500'
                  }`}
                />
                <span className='ml-2 w-12 text-center font-medium'>
                  {profileData.fanSpeed}%
                </span>
              </div>
              {errors.fanSpeed && (
                <p className='mt-1 text-sm text-red-600'>{errors.fanSpeed}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submission Buttons */}
        <div className='flex justify-end space-x-3'>
          <Link
            to='/profiles'
            className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'
          >
            <X size={16} className='mr-1' />
            Cancel
          </Link>

          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center'
          >
            <Save size={16} className='mr-1' />
            {isEdit ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
