import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  RefreshCw,
  Trash,
  AlertCircle,
  CheckCircle,
  Server,
  HardDrive,
  Settings,
  Activity,
  FileText,
  List,
  Save,
} from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { useAuth } from '../context/AuthContext';
import { Device, DeviceReading } from '../types/device.types';

const DeviceDetails: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const { getDevice, updateDevice, deleteDevice, loadingDevice } = useDevices();
  const { user } = useAuth();

  const [device, setDevice] = useState<Device | null>(null);
  const [readings, setReadings] = useState<DeviceReading[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [readingData, setReadingData] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedDevice, setEditedDevice] = useState<Device | null>(null);
  const [activeTab, setActiveTab] = useState<
    'details' | 'registers' | 'readings' | 'edit'
  >('details');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Permissions
  const userPermissions = user?.permissions || [];
  const canEditDevices =
    userPermissions.includes('manage_devices') ||
    userPermissions.includes('edit_devices');
  const canDeleteDevices =
    userPermissions.includes('manage_devices') ||
    userPermissions.includes('delete_devices');
  const canTestDevices =
    userPermissions.includes('manage_devices') ||
    userPermissions.includes('test_devices');

  useEffect(() => {
    const fetchDeviceData = async () => {
      if (!deviceId) return;

      try {
        setLoading(true);
        setError(null);

        const deviceData = await getDevice(deviceId);
        setDevice(deviceData);
        setEditedDevice({ ...deviceData });
      } catch (err: any) {
        console.error('Error fetching device:', err);
        setError(err.message || 'Failed to fetch device details');
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, [deviceId, getDevice]);

  const handleBack = () => {
    navigate('/devices');
  };

  const handleEdit = () => {
    setActiveTab('edit');
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editedDevice) return;

    try {
      setLoading(true);
      setError(null);

      await updateDevice(editedDevice);
      setDevice(editedDevice);
      setIsEditing(false);
      setActiveTab('details');
      setSuccess('Device updated successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating device:', err);
      setError(err.message || 'Failed to update device');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedDevice({ ...device } as Device);
    setIsEditing(false);
    setActiveTab('details');
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deviceId) return;

    try {
      setLoading(true);
      await deleteDevice(deviceId);
      navigate('/devices');
    } catch (err: any) {
      console.error('Error deleting device:', err);
      setError(err.message || 'Failed to delete device');
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!deviceId || !device) return;

    try {
      setTestingConnection(true);
      setError(null);
      setSuccess(null);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success for demo purposes
      setSuccess('Connection test successful');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error testing connection:', err);
      setError(err.message || 'Connection test failed');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleReadRegisters = async () => {
    if (!deviceId || !device) return;

    try {
      setReadingData(true);
      setError(null);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock readings
      const mockReadings: DeviceReading[] =
        device.registers?.map((register) => ({
          name: register.name,
          address: register.address,
          value: Math.random() * 100,
          unit: register.unit || '',
        })) || [];

      setReadings(mockReadings);
    } catch (err: any) {
      console.error('Error reading registers:', err);
      setError(err.message || 'Failed to read registers');
    } finally {
      setReadingData(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!editedDevice) return;

    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
        ? parseInt(value)
        : value;

    setEditedDevice({
      ...editedDevice,
      [name]: newValue,
    });
  };

  if (loading && !device) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (error && !device) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-md p-6 text-center'>
        <AlertCircle size={48} className='mx-auto text-red-500 mb-4' />
        <h2 className='text-xl font-semibold text-red-700 mb-2'>
          Error Loading Device
        </h2>
        <p className='text-red-600 mb-4'>{error}</p>
        <button
          onClick={handleBack}
          className='px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 inline-flex items-center'
        >
          <ArrowLeft size={16} className='mr-2' />
          Back to Devices
        </button>
      </div>
    );
  }

  if (!device) {
    return (
      <div className='bg-gray-50 border border-gray-200 rounded-md p-6 text-center'>
        <AlertCircle size={48} className='mx-auto text-gray-500 mb-4' />
        <h2 className='text-xl font-semibold text-gray-700 mb-2'>
          Device Not Found
        </h2>
        <p className='text-gray-600 mb-4'>
          The requested device could not be found.
        </p>
        <button
          onClick={handleBack}
          className='px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 inline-flex items-center'
        >
          <ArrowLeft size={16} className='mr-2' />
          Back to Devices
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header with device name and actions */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <button
            onClick={handleBack}
            className='flex items-center text-blue-500 hover:text-blue-700 mb-2'
          >
            <ArrowLeft size={16} className='mr-1' />
            Back to devices
          </button>
          <div className='flex items-center'>
            <h1 className='text-2xl font-bold text-gray-800'>{device.name}</h1>
            <div
              className={`ml-3 h-3 w-3 rounded-full ${
                device.enabled ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></div>
          </div>
        </div>

        <div className='flex gap-2'>
          {canTestDevices && (
            <button
              onClick={handleTestConnection}
              disabled={testingConnection || readingData || !device.enabled}
              className='flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {testingConnection ? (
                <>
                  <RefreshCw size={16} className='animate-spin' />
                  Testing...
                </>
              ) : (
                <>
                  <Server size={16} />
                  Test Connection
                </>
              )}
            </button>
          )}

          {canEditDevices && (
            <button
              onClick={handleEdit}
              disabled={isEditing}
              className='flex items-center gap-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Edit size={16} />
              Edit
            </button>
          )}

          {canDeleteDevices && (
            <button
              onClick={handleDelete}
              className='flex items-center gap-1 px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50'
            >
              <Trash size={16} />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Success or error messages */}
      {success && (
        <div className='bg-green-50 border-l-4 border-green-500 p-4 rounded'>
          <div className='flex'>
            <CheckCircle className='text-green-500 mr-3' />
            <span className='text-green-700'>{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded'>
          <div className='flex'>
            <AlertCircle className='text-red-500 mr-3' />
            <span className='text-red-700'>{error}</span>
          </div>
        </div>
      )}

      {/* Tabs navigation */}
      <div className='bg-white rounded-lg shadow'>
        <div className='border-b border-gray-200'>
          <nav className='flex -mb-px'>
            <button
              onClick={() => setActiveTab('details')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className='flex items-center'>
                <HardDrive size={16} className='mr-2' />
                Device Details
              </div>
            </button>
            <button
              onClick={() => setActiveTab('registers')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'registers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className='flex items-center'>
                <List size={16} className='mr-2' />
                Registers
              </div>
            </button>
            <button
              onClick={() => setActiveTab('readings')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'readings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className='flex items-center'>
                <Activity size={16} className='mr-2' />
                Data Readings
              </div>
            </button>
            {isEditing && (
              <button
                onClick={() => setActiveTab('edit')}
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'edit'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className='flex items-center'>
                  <Settings size={16} className='mr-2' />
                  Edit Device
                </div>
              </button>
            )}
          </nav>
        </div>

        {/* Tab content */}
        <div className='p-6'>
          {activeTab === 'details' && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-gray-700 flex items-center'>
                  <Server size={18} className='mr-2 text-blue-500' />
                  Basic Information
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>
                      Name
                    </label>
                    <div className='mt-1 text-gray-900'>{device.name}</div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>
                      Status
                    </label>
                    <div className='mt-1'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          device.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {device.enabled ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  {device.make && (
                    <div>
                      <label className='block text-sm font-medium text-gray-500'>
                        Manufacturer
                      </label>
                      <div className='mt-1 text-gray-900'>{device.make}</div>
                    </div>
                  )}
                  {device.model && (
                    <div>
                      <label className='block text-sm font-medium text-gray-500'>
                        Model
                      </label>
                      <div className='mt-1 text-gray-900'>{device.model}</div>
                    </div>
                  )}
                  {device.lastSeen && (
                    <div>
                      <label className='block text-sm font-medium text-gray-500'>
                        Last Seen
                      </label>
                      <div className='mt-1 text-gray-900'>
                        {new Date(device.lastSeen).toLocaleString()}
                      </div>
                    </div>
                  )}
                  {device.tags && device.tags.length > 0 && (
                    <div className='col-span-2'>
                      <label className='block text-sm font-medium text-gray-500'>
                        Tags
                      </label>
                      <div className='mt-1 flex flex-wrap gap-1'>
                        {device.tags.map((tag, index) => (
                          <span
                            key={index}
                            className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-gray-700 flex items-center'>
                  <Settings size={18} className='mr-2 text-blue-500' />
                  Connection Settings
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>
                      Connection Type
                    </label>
                    <div className='mt-1 text-gray-900'>
                      {device.connectionType || 'TCP'}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>
                      IP Address
                    </label>
                    <div className='mt-1 text-gray-900'>{device.ip}</div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>
                      Port
                    </label>
                    <div className='mt-1 text-gray-900'>{device.port}</div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>
                      Slave ID
                    </label>
                    <div className='mt-1 text-gray-900'>{device.slaveId}</div>
                  </div>
                </div>
              </div>

              {device.description && (
                <div className='col-span-1 md:col-span-2 space-y-2'>
                  <h3 className='text-lg font-medium text-gray-700 flex items-center'>
                    <FileText size={18} className='mr-2 text-blue-500' />
                    Description
                  </h3>
                  <p className='text-gray-700'>{device.description}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'registers' && (
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <h3 className='text-lg font-medium text-gray-700'>
                  Register Configuration
                </h3>
                {canEditDevices && (
                  <button
                    onClick={handleEdit}
                    className='flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50'
                  >
                    <Edit size={14} />
                    Edit Registers
                  </button>
                )}
              </div>

              {device.registers && device.registers.length > 0 ? (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Name
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Address
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Function Code
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Length
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Scale Factor
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Unit
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {device.registers.map((register, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }
                        >
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {register.name}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {register.address}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {register.functionCode || '3'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {register.length}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {register.scaleFactor || '1'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {register.unit || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='bg-gray-50 p-8 rounded-lg text-center'>
                  <FileText size={32} className='mx-auto text-gray-400 mb-4' />
                  <h3 className='text-lg font-medium text-gray-700 mb-2'>
                    No Registers Configured
                  </h3>
                  <p className='text-gray-500 mb-4'>
                    This device doesn't have any registers configured yet.
                  </p>
                  {canEditDevices && (
                    <button
                      onClick={handleEdit}
                      className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                    >
                      Configure Registers
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'readings' && (
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <h3 className='text-lg font-medium text-gray-700'>
                  Data Readings
                </h3>
                {canTestDevices && (
                  <button
                    onClick={handleReadRegisters}
                    disabled={readingData || !device.enabled}
                    className='flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {readingData ? (
                      <>
                        <RefreshCw size={16} className='animate-spin' />
                        Reading...
                      </>
                    ) : (
                      <>
                        <Activity size={16} />
                        Read Data
                      </>
                    )}
                  </button>
                )}
              </div>

              {!device.enabled && (
                <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded'>
                  <div className='flex'>
                    <AlertCircle className='text-yellow-400 mr-3' />
                    <div>
                      <p className='text-sm text-yellow-700'>
                        Device is currently disabled. Enable the device to read
                        data.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {readings.length > 0 ? (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Register
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Address
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Value
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Unit
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {readings.map((reading, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }
                        >
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {reading.name}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {reading.address}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {typeof reading.value === 'number'
                              ? reading.value.toFixed(2)
                              : reading.value || 'Error'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {reading.unit || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='bg-gray-50 p-8 rounded-lg text-center'>
                  <Activity size={32} className='mx-auto text-gray-400 mb-4' />
                  <h3 className='text-lg font-medium text-gray-700 mb-2'>
                    No Data Read Yet
                  </h3>
                  <p className='text-gray-500 mb-4'>
                    Click the "Read Data" button to fetch current values from
                    this device.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'edit' && editedDevice && (
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-700'>Edit Device</h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <h4 className='font-medium text-gray-700'>
                    Basic Information
                  </h4>

                  <div className='grid grid-cols-1 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Device Name *
                      </label>
                      <input
                        type='text'
                        name='name'
                        value={editedDevice.name}
                        onChange={handleInputChange}
                        className='w-full p-2 border rounded'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Manufacturer
                      </label>
                      <input
                        type='text'
                        name='make'
                        value={editedDevice.make || ''}
                        onChange={handleInputChange}
                        className='w-full p-2 border rounded'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Model
                      </label>
                      <input
                        type='text'
                        name='model'
                        value={editedDevice.model || ''}
                        onChange={handleInputChange}
                        className='w-full p-2 border rounded'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Description
                      </label>
                      <textarea
                        name='description'
                        value={editedDevice.description || ''}
                        onChange={handleInputChange}
                        className='w-full p-2 border rounded h-20 resize-none'
                      />
                    </div>

                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        id='enabled'
                        name='enabled'
                        checked={editedDevice.enabled}
                        onChange={handleInputChange}
                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                      />
                      <label
                        htmlFor='enabled'
                        className='ml-2 block text-sm text-gray-700'
                      >
                        Device Enabled
                      </label>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='font-medium text-gray-700'>
                    Connection Settings
                  </h4>

                  <div className='grid grid-cols-1 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        IP Address *
                      </label>
                      <input
                        type='text'
                        name='ip'
                        value={editedDevice.ip || ''}
                        onChange={handleInputChange}
                        className='w-full p-2 border rounded'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Port *
                      </label>
                      <input
                        type='number'
                        name='port'
                        value={editedDevice.port || 502}
                        onChange={handleInputChange}
                        className='w-full p-2 border rounded'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Slave ID *
                      </label>
                      <input
                        type='number'
                        name='slaveId'
                        value={editedDevice.slaveId}
                        onChange={handleInputChange}
                        className='w-full p-2 border rounded'
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex justify-end gap-2 pt-4 border-t'>
                <button
                  onClick={handleCancelEdit}
                  className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2'
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg max-w-md w-full p-6'>
            <h2 className='text-xl font-semibold mb-4'>Confirm Delete</h2>
            <p className='mb-4'>
              Are you sure you want to delete this device? This action cannot be
              undone.
            </p>
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setShowDeleteModal(false)}
                className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceDetails;
