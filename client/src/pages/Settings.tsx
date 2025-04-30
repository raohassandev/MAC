import * as Yup from 'yup';

import {
  Bell,
  Save,
  Settings as SettingsIcon,
  Shield,
  User,
} from 'lucide-react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { settingsApi, userApi } from '../services/endpoints';
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

interface SystemSettings {
  refreshInterval: number;
  darkMode: boolean;
  alertThreshold: {
    cpu: number;
    memory: number;
    disk: number;
    temperature: number;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface UserSettings {
  username: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'system' | 'user' | 'notifications' | 'security'
  >('system');
  const [isLoading, setIsLoading] = useState(true);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    refreshInterval: 30,
    darkMode: false,
    alertThreshold: {
      cpu: 80,
      memory: 80,
      disk: 85,
      temperature: 70,
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await settingsApi.getSettings();
        setSystemSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings', error);
        // Use default settings if API fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSystemSettingsSubmit = async (values: SystemSettings) => {
    try {
      await settingsApi.updateSettings(values);
      setSystemSettings(values);
      toast.success('System settings updated successfully');
    } catch (error) {
      console.error('Error updating system settings', error);
      toast.error('Failed to update system settings');
    }
  };

  const handleUserSettingsSubmit = async (values: UserSettings) => {
    try {
      // Update user profile
      await userApi.updateProfile({
        username: values.username,
        email: values.email,
      });

      // Update password if provided
      if (values.oldPassword && values.newPassword) {
        await userApi.changePassword(values.oldPassword, values.newPassword);
      }

      toast.success('User settings updated successfully');
    } catch (error) {
      console.error('Error updating user settings', error);
      toast.error('Failed to update user settings');
    }
  };

  const handleNotificationSettingsSubmit = async (values: {
    notifications: SystemSettings['notifications'];
  }) => {
    try {
      await settingsApi.updateNotificationSettings(values.notifications);
      setSystemSettings((prev) => ({
        ...prev,
        notifications: values.notifications,
      }));
      toast.success('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings', error);
      toast.error('Failed to update notification settings');
    }
  };

  const userValidationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    oldPassword: Yup.string().when('newPassword', {
      is: (val: string) => val && val.length > 0,
      then: (schema) =>
        schema.required('Current password is required to set a new password'),
    }),
    newPassword: Yup.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string().when('newPassword', {
      is: (val: string) => val && val.length > 0,
      then: (schema) =>
        schema
          .required('Please confirm your password')
          .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
    }),
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold text-gray-800'>Settings</h1>

      <div className='bg-white rounded-lg shadow-md'>
        <div className='border-b border-gray-200'>
          <nav className='flex -mb-px'>
            <button
              onClick={() => setActiveTab('system')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 flex items-center ${
                activeTab === 'system'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SettingsIcon size={16} className='mr-2' />
              System Settings
            </button>
            <button
              onClick={() => setActiveTab('user')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 flex items-center ${
                activeTab === 'user'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User size={16} className='mr-2' />
              User Profile
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 flex items-center ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell size={16} className='mr-2' />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 flex items-center ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield size={16} className='mr-2' />
              Security
            </button>
          </nav>
        </div>

        <div className='p-6'>
          {activeTab === 'system' && (
            <div>
              <h2 className='text-lg font-semibold text-gray-700 mb-4'>
                System Settings
              </h2>
              <Formik
                initialValues={systemSettings}
                onSubmit={handleSystemSettingsSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className='space-y-6'>
                    <div>
                      <label
                        htmlFor='refreshInterval'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Auto-refresh Interval (seconds)
                      </label>
                      <div className='mt-1'>
                        <Field
                          type='number'
                          name='refreshInterval'
                          id='refreshInterval'
                          min='10'
                          max='300'
                          className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
                        />
                        <ErrorMessage
                          name='refreshInterval'
                          component='div'
                          className='mt-1 text-sm text-red-600'
                        />
                      </div>
                    </div>

                    <div className='flex items-center'>
                      <Field
                        type='checkbox'
                        name='darkMode'
                        id='darkMode'
                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                      />
                      <label
                        htmlFor='darkMode'
                        className='ml-2 block text-sm text-gray-700'
                      >
                        Enable Dark Mode
                      </label>
                    </div>

                    <div>
                      <h3 className='text-sm font-medium text-gray-700 mb-2'>
                        Alert Thresholds
                      </h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label
                            htmlFor='alertThreshold.cpu'
                            className='block text-sm text-gray-600'
                          >
                            CPU Usage (%)
                          </label>
                          <Field
                            type='number'
                            name='alertThreshold.cpu'
                            id='alertThreshold.cpu'
                            min='50'
                            max='95'
                            className='mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='alertThreshold.memory'
                            className='block text-sm text-gray-600'
                          >
                            Memory Usage (%)
                          </label>
                          <Field
                            type='number'
                            name='alertThreshold.memory'
                            id='alertThreshold.memory'
                            min='50'
                            max='95'
                            className='mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='alertThreshold.disk'
                            className='block text-sm text-gray-600'
                          >
                            Disk Usage (%)
                          </label>
                          <Field
                            type='number'
                            name='alertThreshold.disk'
                            id='alertThreshold.disk'
                            min='50'
                            max='95'
                            className='mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='alertThreshold.temperature'
                            className='block text-sm text-gray-600'
                          >
                            Temperature (°C)
                          </label>
                          <Field
                            type='number'
                            name='alertThreshold.temperature'
                            id='alertThreshold.temperature'
                            min='50'
                            max='90'
                            className='mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='pt-5'>
                      <div className='flex justify-end'>
                        <button
                          type='submit'
                          disabled={isSubmitting}
                          className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                              >
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'
                                ></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                ></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className='mr-2' />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {activeTab === 'user' && (
            <div>
              <h2 className='text-lg font-semibold text-gray-700 mb-4'>
                User Profile
              </h2>
              <Formik
                initialValues={{
                  username: user?.username || '',
                  email: user?.email || '',
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                }}
                validationSchema={userValidationSchema}
                onSubmit={handleUserSettingsSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className='space-y-6'>
                    <div>
                      <label
                        htmlFor='username'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Username
                      </label>
                      <div className='mt-1'>
                        <Field
                          type='text'
                          name='username'
                          id='username'
                          className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
                        />
                        <ErrorMessage
                          name='username'
                          component='div'
                          className='mt-1 text-sm text-red-600'
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Email Address
                      </label>
                      <div className='mt-1'>
                        <Field
                          type='email'
                          name='email'
                          id='email'
                          className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
                        />
                        <ErrorMessage
                          name='email'
                          component='div'
                          className='mt-1 text-sm text-red-600'
                        />
                      </div>
                    </div>

                    <div className='border-t border-gray-200 pt-4'>
                      <h3 className='text-sm font-medium text-gray-700 mb-2'>
                        Change Password
                      </h3>

                      <div>
                        <label
                          htmlFor='oldPassword'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Current Password
                        </label>
                        <div className='mt-1'>
                          <Field
                            type='password'
                            name='oldPassword'
                            id='oldPassword'
                            className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          />
                          <ErrorMessage
                            name='oldPassword'
                            component='div'
                            className='mt-1 text-sm text-red-600'
                          />
                        </div>
                      </div>

                      <div className='mt-4'>
                        <label
                          htmlFor='newPassword'
                          className='block text-sm font-medium text-gray-700'
                        >
                          New Password
                        </label>
                        <div className='mt-1'>
                          <Field
                            type='password'
                            name='newPassword'
                            id='newPassword'
                            className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          />
                          <ErrorMessage
                            name='newPassword'
                            component='div'
                            className='mt-1 text-sm text-red-600'
                          />
                        </div>
                      </div>

                      <div className='mt-4'>
                        <label
                          htmlFor='confirmPassword'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Confirm New Password
                        </label>
                        <div className='mt-1'>
                          <Field
                            type='password'
                            name='confirmPassword'
                            id='confirmPassword'
                            className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          />
                          <ErrorMessage
                            name='confirmPassword'
                            component='div'
                            className='mt-1 text-sm text-red-600'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='pt-5'>
                      <div className='flex justify-end'>
                        <button
                          type='submit'
                          disabled={isSubmitting}
                          className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                              >
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'
                                ></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                ></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className='mr-2' />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className='text-lg font-semibold text-gray-700 mb-4'>
                Notification Settings
              </h2>
              <Formik
                initialValues={{ notifications: systemSettings.notifications }}
                onSubmit={handleNotificationSettingsSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className='space-y-6'>
                    <div className='space-y-4'>
                      <div className='flex items-center'>
                        <Field
                          type='checkbox'
                          name='notifications.email'
                          id='notifications.email'
                          className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                        />
                        <label
                          htmlFor='notifications.email'
                          className='ml-2 block text-sm text-gray-700'
                        >
                          Email Notifications
                        </label>
                      </div>

                      <div className='flex items-center'>
                        <Field
                          type='checkbox'
                          name='notifications.push'
                          id='notifications.push'
                          className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                        />
                        <label
                          htmlFor='notifications.push'
                          className='ml-2 block text-sm text-gray-700'
                        >
                          Push Notifications
                        </label>
                      </div>

                      <div className='flex items-center'>
                        <Field
                          type='checkbox'
                          name='notifications.sms'
                          id='notifications.sms'
                          className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                        />
                        <label
                          htmlFor='notifications.sms'
                          className='ml-2 block text-sm text-gray-700'
                        >
                          SMS Notifications
                        </label>
                      </div>
                    </div>

                    <div className='pt-5'>
                      <div className='flex justify-end'>
                        <button
                          type='submit'
                          disabled={isSubmitting}
                          className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                              >
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'
                                ></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                ></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className='mr-2' />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className='text-lg font-semibold text-gray-700 mb-4'>
                Security Settings
              </h2>
              <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <Shield size={20} className='text-yellow-400' />
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm text-yellow-700'>
                      Security settings are managed by your system
                      administrator. Contact them for any security-related
                      changes.
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-sm font-medium text-gray-700'>
                    Two-Factor Authentication
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Two-factor authentication is currently disabled. Contact
                    your administrator to enable it.
                  </p>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-gray-700'>
                    Session Management
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Your current session will expire in 8 hours.
                  </p>
                  <button
                    type='button'
                    className='mt-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  >
                    End All Other Sessions
                  </button>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-gray-700'>
                    Login History
                  </h3>
                  <div className='mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th
                            scope='col'
                            className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            Date
                          </th>
                          <th
                            scope='col'
                            className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            IP Address
                          </th>
                          <th
                            scope='col'
                            className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            Device
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        <tr>
                          <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                            April 30, 2025 14:32
                          </td>
                          <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                            192.168.1.105
                          </td>
                          <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                            Chrome on Windows
                          </td>
                        </tr>
                        <tr>
                          <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                            April 29, 2025 09:15
                          </td>
                          <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                            192.168.1.105
                          </td>
                          <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                            Chrome on Windows
                          </td>
                        </tr>
                        <tr>
                          <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                            April 28, 2025 11:42
                          </td>
                          <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                            10.0.0.15
                          </td>
                          <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                            Safari on iOS
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
