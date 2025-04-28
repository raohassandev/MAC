import {
  AlertCircle,
  ArrowLeft,
  BarChart,
  CheckCircle,
  Clock,
  Edit,
  HardDrive,
  List,
  RefreshCw,
  Settings,
  ThermometerSnowflake,
  Trash,
  XCircle,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import DeviceDataChart from '../components/devices/DeviceDataChart';
import DeviceForm from '../components/devices/DeviceForm';
import DeviceStatusCard from '../components/devices/DeviceStatusCard';
import RegisterTable from '../components/devices/RegisterTable';
import { useDevices } from '../hooks/useDevices';

interface TabProps {
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const Tab = ({ isActive, icon, label, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 border-indigo-700'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
    }`}
  >
    <span className='mr-2'>{icon}</span>
    {label}
  </button>
);

const DeviceDetails = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const { getDevice, updateDevice, deleteDevice, loadingDevice, deviceError } =
    useDevices();
  const [device, setDevice] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'registers' | 'history' | 'alerts'
  >('overview');
  const [showEditForm, setShowEditForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sample data - this would come from your API in a real application
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [deviceAlerts, setDeviceAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (deviceId) {
      loadDevice();
    }
  }, [deviceId]);

  const loadDevice = async () => {
    if (!deviceId) return;

    try {
      const deviceData = await getDevice(deviceId);
      setDevice(deviceData);

      // Generate sample data for demonstration
      generateSampleData();
      generateSampleAlerts();
    } catch (error) {
      console.error('Error loading device:', error);
    }
  };

  const generateSampleData = () => {
    // Generate sample temperature and humidity data for the past 24 hours
    const now = new Date();
    const data = Array.from({ length: 24 }, (_, i) => {
      const time = new Date(now);
      time.setHours(now.getHours() - 23 + i);

      return {
        timestamp: time.toISOString(),
        temperature: Math.round((22 + Math.sin(i / 3) * 3) * 10) / 10,
        humidity: Math.round((50 + Math.cos(i / 4) * 10) * 10) / 10,
      };
    });

    setDeviceData(data);
  };

  const generateSampleAlerts = () => {
    const now = new Date();
    const alerts = [
      {
        id: '1',
        timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        message: 'Temperature exceeded threshold (28°C)',
        severity: 'error',
      },
      {
        id: '2',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        message: 'Connection temporarily lost',
        severity: 'warning',
      },
      {
        id: '3',
        timestamp: new Date(
          now.getTime() - 1000 * 60 * 60 * 24 * 2
        ).toISOString(), // 2 days ago
        message: 'Device maintenance performed',
        severity: 'info',
      },
    ];

    setDeviceAlerts(alerts);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDevice();
    setTimeout(() => setRefreshing(false), 500); // Add a small delay to show the refreshing state
  };

  const handleToggleStatus = async () => {
    if (!device) return;

    try {
      const updatedDevice = { ...device, enabled: !device.enabled };
      await updateDevice(updatedDevice);
      setDevice(updatedDevice);
    } catch (error) {
      console.error('Error updating device status:', error);
    }
  };

  const handleDelete = async () => {
    if (!device) return;

    if (window.confirm(`Are you sure you want to delete "${device.name}"?`)) {
      try {
        await deleteDevice(device._id);
        navigate('/devices');
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  };

  if (loadingDevice) {
    return (
      <div className='p-8 text-center text-gray-500 animate-pulse'>
        <HardDrive className='mx-auto mb-4' size={32} />
        <p>Loading device details...</p>
      </div>
    );
  }

  if (deviceError) {
    return (
      <div className='p-6 bg-red-50 text-red-600 rounded-lg'>
        <h2 className='text-lg font-semibold mb-2'>Error Loading Device</h2>
        <p>{deviceError.message || 'An unknown error occurred'}</p>
        <Link
          to='/devices'
          className='mt-4 inline-block text-blue-500 hover:underline'
        >
          &larr; Back to device list
        </Link>
      </div>
    );
  }

  if (!device) {
    return (
      <div className='p-6 bg-gray-50 text-gray-600 rounded-lg'>
        <h2 className='text-lg font-semibold mb-2'>Device Not Found</h2>
        <p>The device you're looking for doesn't exist or has been removed.</p>
        <Link
          to='/devices'
          className='mt-4 inline-block text-blue-500 hover:underline'
        >
          &larr; Back to device list
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Navigation and Actions Bar */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <Link
            to='/devices'
            className='flex items-center text-blue-500 hover:text-blue-700 mb-2'
          >
            <ArrowLeft size={16} className='mr-1' />
            Back to devices
          </Link>
          <h1 className='text-2xl font-bold text-gray-800'>{device.name}</h1>
        </div>

        <div className='flex flex-wrap gap-2'>
          <button
            onClick={handleRefresh}
            className={`flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ${
              refreshing ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowEditForm(true)}
            className='flex items-center gap-1 px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600'
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>

          <button
            onClick={handleToggleStatus}
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${
              device.enabled
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {device.enabled ? <XCircle size={16} /> : <CheckCircle size={16} />}
            <span>{device.enabled ? 'Disable' : 'Enable'}</span>
          </button>

          <button
            onClick={handleDelete}
            className='flex items-center gap-1 px-3 py-2 bg-white border border-red-300 text-red-600 rounded-md hover:bg-red-50'
          >
            <Trash size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6'>
            <h2 className='text-xl font-bold mb-4'>Edit Device</h2>
            <DeviceForm
              editDevice={device}
              onSave={(updatedDevice) => {
                setDevice(updatedDevice);
                setShowEditForm(false);
              }}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}

      {/* Device Status Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <DeviceStatusCard
          title='Connection Status'
          value={device.enabled ? 'Online' : 'Offline'}
          icon={
            device.enabled ? (
              <CheckCircle className='text-green-500' />
            ) : (
              <XCircle className='text-red-500' />
            )
          }
          detail={
            device.ip ? `${device.ip}:${device.port}` : 'No connection info'
          }
        />

        <DeviceStatusCard
          title='Slave ID'
          value={device.slaveId.toString()}
          icon={<Settings className='text-gray-500' />}
          detail='Modbus device identifier'
        />

        <DeviceStatusCard
          title='Registers'
          value={device.registers?.length.toString() || '0'}
          icon={<List className='text-blue-500' />}
          detail='Data points being monitored'
        />
      </div>

      {/* Tabs Navigation */}
      <div className='bg-white rounded-lg shadow-sm p-4'>
        <div className='flex flex-wrap gap-2'>
          <Tab
            isActive={activeTab === 'overview'}
            icon={<BarChart size={16} />}
            label='Overview'
            onClick={() => setActiveTab('overview')}
          />
          <Tab
            isActive={activeTab === 'registers'}
            icon={<List size={16} />}
            label='Registers'
            onClick={() => setActiveTab('registers')}
          />
          <Tab
            isActive={activeTab === 'history'}
            icon={<Clock size={16} />}
            label='History'
            onClick={() => setActiveTab('history')}
          />
          <Tab
            isActive={activeTab === 'alerts'}
            icon={<AlertCircle size={16} />}
            label='Alerts'
            onClick={() => setActiveTab('alerts')}
          />
        </div>

        {/* Tab Content */}
        <div className='mt-4'>
          {activeTab === 'overview' && (
            <div>
              <h3 className='text-lg font-semibold mb-4 flex items-center'>
                <ThermometerSnowflake
                  className='mr-2 text-blue-500'
                  size={20}
                />
                Real-time Measurements
              </h3>
              <div className='h-80'>
                <DeviceDataChart data={deviceData} />
              </div>
              <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h4 className='text-md font-medium mb-3'>
                    Device Information
                  </h4>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <dl className='grid grid-cols-3 gap-4'>
                      <div className='col-span-1 font-medium text-gray-500'>
                        Name
                      </div>
                      <div className='col-span-2'>{device.name}</div>

                      <div className='col-span-1 font-medium text-gray-500'>
                        IP Address
                      </div>
                      <div className='col-span-2'>{device.ip || 'N/A'}</div>

                      <div className='col-span-1 font-medium text-gray-500'>
                        Port
                      </div>
                      <div className='col-span-2'>{device.port || 'N/A'}</div>

                      <div className='col-span-1 font-medium text-gray-500'>
                        Slave ID
                      </div>
                      <div className='col-span-2'>{device.slaveId}</div>

                      <div className='col-span-1 font-medium text-gray-500'>
                        Status
                      </div>
                      <div className='col-span-2'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            device.enabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {device.enabled ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </dl>
                  </div>
                </div>

                <div>
                  <h4 className='text-md font-medium mb-3'>Latest Readings</h4>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    {device.registers && device.registers.length > 0 ? (
                      <dl className='space-y-3'>
                        {device.registers.map(
                          (register: any, index: number) => (
                            <div key={index} className='grid grid-cols-2'>
                              <dt className='font-medium text-gray-500'>
                                {register.name}
                              </dt>
                              <dd className='text-right'>
                                {deviceData.length > 0 ? (
                                  <span className='font-semibold'>
                                    {deviceData[deviceData.length - 1][
                                      register.name.toLowerCase()
                                    ] || 'N/A'}
                                  </span>
                                ) : (
                                  <span className='text-gray-400'>No data</span>
                                )}
                              </dd>
                            </div>
                          )
                        )}
                      </dl>
                    ) : (
                      <p className='text-gray-500 text-center py-4'>
                        No registers configured
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'registers' && (
            <div>
              <h3 className='text-lg font-semibold mb-4'>
                Registers Configuration
              </h3>
              <RegisterTable registers={device.registers || []} />
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className='text-lg font-semibold mb-4'>Historical Data</h3>
              <div className='bg-gray-50 p-6 rounded-lg text-center'>
                <p className='text-gray-500'>
                  Historical data view will be implemented in future releases.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div>
              <h3 className='text-lg font-semibold mb-4'>Device Alerts</h3>
              {deviceAlerts.length === 0 ? (
                <div className='bg-gray-50 p-6 rounded-lg text-center'>
                  <p className='text-gray-500'>No alerts for this device</p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {deviceAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border-l-4 rounded-r-md ${
                        alert.severity === 'error'
                          ? 'border-red-500 bg-red-50'
                          : alert.severity === 'warning'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className='flex justify-between'>
                        <span className='font-medium'>
                          {alert.severity === 'error'
                            ? 'Error'
                            : alert.severity === 'warning'
                            ? 'Warning'
                            : 'Information'}
                        </span>
                        <span className='text-sm text-gray-500'>
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className='mt-1'>{alert.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceDetails;
