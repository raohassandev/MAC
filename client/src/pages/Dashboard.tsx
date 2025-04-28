import {
  AlertCircle,
  CheckCircle,
  Clock,
  HardDrive,
  ThermometerSnowflake,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import DeviceStatusChart from '../components/dashboard/DeviceStatusChart';
import { Link } from 'react-router-dom';
import QuickAccessDevices from '../components/dashboard/QuickAccessDevices';
import RecentAlerts from '../components/dashboard/RecentAlerts';
// Components
import StatusCard from '../components/dashboard/StatusCard';
import TemperatureChart from '../components/dashboard/TemperatureChart';
import { useDevices } from '../hooks/useDevices';

interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
}

const Dashboard = () => {
  const { devices, loading, error } = useDevices();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Normally this would be from an API, but for demo we'll create some sample alerts
    setAlerts([
      {
        id: '1',
        deviceId: '123',
        deviceName: 'Main Cooling Unit',
        message: 'Temperature exceeded threshold (28°C)',
        severity: 'error',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        isRead: false,
      },
      {
        id: '2',
        deviceId: '456',
        deviceName: 'Server Room Cooler',
        message: 'Connection lost',
        severity: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        isRead: false,
      },
      {
        id: '3',
        deviceId: '789',
        deviceName: 'Office AC',
        message: 'Maintenance required',
        severity: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        isRead: true,
      },
    ]);
  }, []);

  if (loading) {
    return <div className='animate-pulse p-4'>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className='bg-red-50 text-red-600 p-4 rounded-lg'>
        Error loading dashboard: {error.message}
      </div>
    );
  }

  // Calculate statistics
  const totalDevices = devices?.length || 0;
  const onlineDevices = devices?.filter((d) => d.enabled).length || 0;
  const offlineDevices = totalDevices - onlineDevices;
  const unreadAlerts = alerts.filter((a) => !a.isRead).length;

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>System Dashboard</h1>
        <div className='text-sm text-gray-500'>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Status Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatusCard
          title='Total Devices'
          value={totalDevices.toString()}
          icon={<HardDrive className='text-blue-500' />}
          bgColor='bg-blue-50'
        />
        <StatusCard
          title='Online Devices'
          value={onlineDevices.toString()}
          icon={<CheckCircle className='text-green-500' />}
          bgColor='bg-green-50'
        />
        <StatusCard
          title='Offline Devices'
          value={offlineDevices.toString()}
          icon={<Clock className='text-orange-500' />}
          bgColor='bg-orange-50'
        />
        <StatusCard
          title='Active Alerts'
          value={unreadAlerts.toString()}
          icon={<AlertCircle className='text-red-500' />}
          bgColor='bg-red-50'
        />
      </div>

      {/* Charts and Quick Access */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Device Status Chart */}
        <div className='bg-white rounded-lg shadow-sm p-4 lg:col-span-2'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <ThermometerSnowflake className='mr-2 text-blue-500' size={20} />
            Temperature Trends
          </h2>
          <TemperatureChart />
        </div>

        {/* Quick Access */}
        <div className='bg-white rounded-lg shadow-sm p-4'>
          <h2 className='text-lg font-semibold mb-4'>Quick Access</h2>
          <QuickAccessDevices devices={devices?.slice(0, 5) || []} />
          <div className='mt-4 text-center'>
            <Link
              to='/devices'
              className='text-blue-500 hover:text-blue-700 text-sm'
            >
              View all devices →
            </Link>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Device Status Distribution */}
        <div className='bg-white rounded-lg shadow-sm p-4'>
          <h2 className='text-lg font-semibold mb-4'>Device Status</h2>
          <DeviceStatusChart online={onlineDevices} offline={offlineDevices} />
        </div>

        {/* Recent Alerts */}
        <div className='bg-white rounded-lg shadow-sm p-4 lg:col-span-2'>
          <h2 className='text-lg font-semibold mb-4'>Recent Alerts</h2>
          <RecentAlerts alerts={alerts} />
          <div className='mt-4 text-center'>
            <Link
              to='/alerts'
              className='text-blue-500 hover:text-blue-700 text-sm'
            >
              View all alerts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
