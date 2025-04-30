import {
  Activity,
  AlertCircle,
  BarChart,
  Bell,
  CheckCircle,
  Clock,
  HardDrive,
  ServerCrash,
  Settings,
  Thermometer,
  Users,
} from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import React, { useEffect, useState } from 'react';

import QuickActionPanel from '../components/dashboard/QuickActionPanel';
// New component imports
import SystemStatus from '../components/dashboard/SystemStatus';

const Dashboard: React.FC = () => {
  const [deviceStats, setDeviceStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
  });
  const [temperatureData, setTemperatureData] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState({
    activeUsers: 0,
    todayLogins: 0,
    newUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterDeviceType, setFilterDeviceType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Mock API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Sample device statistics
        setDeviceStats({
          total: 5,
          online: 3,
          offline: 2,
        });

        // Sample user activity data
        setUserActivity({
          activeUsers: 8,
          todayLogins: 12,
          newUsers: 2,
        });

        // Generate sample temperature data for the past 24 hours
        const now = new Date();
        const tempData = Array.from({ length: 24 }, (_, i) => {
          const time = new Date(now);
          time.setHours(now.getHours() - 23 + i);

          return {
            time: time.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            'Server Room': Math.round((22 + Math.sin(i / 3) * 3) * 10) / 10,
            'Office Area': Math.round((24 + Math.cos(i / 4) * 2) * 10) / 10,
            'Data Center': Math.round((20 + Math.sin(i / 2) * 1) * 10) / 10,
          };
        });

        setTemperatureData(tempData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [filterLocation, filterDeviceType, filterStatus]); // Re-fetch when filters change

  // For device status pie chart
  const deviceStatusData = [
    { name: 'Online', value: deviceStats.online, color: '#10b981' }, // green
    { name: 'Offline', value: deviceStats.offline, color: '#ef4444' }, // red
  ];

  // Last updated time
  const lastUpdated = new Date().toLocaleTimeString();

  // Dashboard filters
  const locations = ['Server Room', 'Office Area', 'Data Center'];
  const deviceTypes = [
    'Temperature Controller',
    'Energy Analyzer',
    'PLC',
    'VFD',
    'Sensor',
  ];
  const statuses = ['Online', 'Offline', 'Warning', 'Error'];

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Dashboard</h1>
        <div className='flex items-center space-x-2'>
          <div className='text-sm text-gray-500'>
            Last updated: {lastUpdated}
          </div>
          <button
            className='p-2 rounded-full hover:bg-gray-100'
            onClick={() => window.location.reload()}
            title='Refresh dashboard'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M21 2v6h-6'></path>
              <path d='M3 12a9 9 0 0 1 15-6.7L21 8'></path>
              <path d='M3 22v-6h6'></path>
              <path d='M21 12a9 9 0 0 1-15 6.7L3 16'></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Dashboard Filters */}
      <div className='bg-white rounded-lg shadow-sm p-4'>
        <div className='flex flex-wrap gap-4'>
          <div className='flex-1 min-w-[200px]'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Location
            </label>
            <select
              className='w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value='all'>All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className='flex-1 min-w-[200px]'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Device Type
            </label>
            <select
              className='w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
              value={filterDeviceType}
              onChange={(e) => setFilterDeviceType(e.target.value)}
            >
              <option value='all'>All Types</option>
              {deviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className='flex-1 min-w-[200px]'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Status
            </label>
            <select
              className='w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value='all'>All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className='animate-pulse p-8 text-center text-gray-500'>
          <BarChart className='mx-auto mb-4' size={32} />
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Status Cards - First Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <StatusCard
              title='Total Devices'
              value={deviceStats.total.toString()}
              icon={<HardDrive className='text-blue-500' />}
              bgColor='bg-blue-50'
              textColor='text-blue-700'
            />
            <StatusCard
              title='Online Devices'
              value={deviceStats.online.toString()}
              icon={<CheckCircle className='text-green-500' />}
              bgColor='bg-green-50'
              textColor='text-green-700'
            />
            <StatusCard
              title='Offline Devices'
              value={deviceStats.offline.toString()}
              icon={<AlertCircle className='text-red-500' />}
              bgColor='bg-red-50'
              textColor='text-red-700'
            />
            <StatusCard
              title='Average Temp'
              value='22.5°C'
              icon={<Thermometer className='text-amber-500' />}
              bgColor='bg-amber-50'
              textColor='text-amber-700'
            />
          </div>

          {/* User Metrics - New Row */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <StatusCard
              title='Active Users'
              value={userActivity.activeUsers.toString()}
              icon={<Users className='text-indigo-500' />}
              bgColor='bg-indigo-50'
              textColor='text-indigo-700'
            />
            <StatusCard
              title="Today's Logins"
              value={userActivity.todayLogins.toString()}
              icon={<Clock className='text-purple-500' />}
              bgColor='bg-purple-50'
              textColor='text-purple-700'
            />
            <StatusCard
              title='New Users (7 days)'
              value={userActivity.newUsers.toString()}
              icon={<Users className='text-cyan-500' />}
              bgColor='bg-cyan-50'
              textColor='text-cyan-700'
            />
          </div>

          {/* System Status Indicators - New Component */}
          <SystemStatus />

          {/* Quick Action Panel - New Component */}
          <QuickActionPanel />

          {/* Charts */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Temperature Chart */}
            <div className='bg-white rounded-lg shadow-sm p-4 lg:col-span-2'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold flex items-center'>
                  <Thermometer className='mr-2 text-blue-500' size={20} />
                  Temperature Trends
                </h2>
                <div className='flex space-x-2'>
                  <button className='px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-md'>
                    24h
                  </button>
                  <button className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md'>
                    7d
                  </button>
                  <button className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md'>
                    30d
                  </button>
                </div>
              </div>
              <div className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart
                    data={temperatureData}
                    margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis
                      dataKey='time'
                      tick={{ fontSize: 12 }}
                      interval='preserveStartEnd'
                    />
                    <YAxis
                      label={{
                        value: '°C',
                        angle: -90,
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' },
                      }}
                      domain={[16, 30]}
                    />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type='monotone'
                      dataKey='Server Room'
                      stroke='#3b82f6'
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type='monotone'
                      dataKey='Office Area'
                      stroke='#10b981'
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type='monotone'
                      dataKey='Data Center'
                      stroke='#f59e0b'
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Device Status Chart */}
            <div className='bg-white rounded-lg shadow-sm p-4'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold flex items-center'>
                  <Activity className='mr-2 text-blue-500' size={20} />
                  Device Status
                </h2>
                <button className='p-1 rounded-md hover:bg-gray-100'>
                  <Settings size={16} className='text-gray-500' />
                </button>
              </div>
              <div className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={deviceStatusData}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey='value'
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {deviceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} devices`, 'Count']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Alert Management Center */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold flex items-center'>
                <Bell className='mr-2 text-blue-500' size={20} />
                Alert Management Center
              </h2>
              <div className='flex space-x-2'>
                <button className='px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md'>
                  Critical (2)
                </button>
                <button className='px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded-md'>
                  Warning (3)
                </button>
                <button className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md'>
                  All
                </button>
              </div>
            </div>
            <div className='space-y-4'>
              <AlertItem
                title='Temperature Alert'
                description='Server Room temperature exceeded threshold (28°C)'
                time='15 minutes ago'
                type='critical'
                deviceId='dev-001'
                status='unresolved'
              />
              <AlertItem
                title='Device Status Change'
                description='Office AC Unit is now offline'
                time='1 hour ago'
                type='warning'
                deviceId='dev-002'
                status='investigating'
              />
              <AlertItem
                title='Connection Timeout'
                description='Data Center Cooling Unit is not responding'
                time='2 hours ago'
                type='critical'
                deviceId='dev-003'
                status='unresolved'
              />
              <AlertItem
                title='Fan Speed Alert'
                description='Server Room backup unit fan speed below threshold'
                time='3 hours ago'
                type='warning'
                deviceId='dev-004'
                status='resolved'
              />
            </div>
            <div className='mt-4 text-center'>
              <button className='text-blue-500 text-sm hover:text-blue-700'>
                View all alerts
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <h2 className='text-lg font-semibold mb-4 flex items-center'>
              <Clock className='mr-2 text-blue-500' size={20} />
              Recent Activity
            </h2>
            <div className='space-y-4'>
              <ActivityItem
                title='User Activity'
                description='John Smith applied cooling profile to Server Room devices'
                time='10 minutes ago'
                type='info'
              />
              <ActivityItem
                title='Profile Change'
                description='Default cooling profile was updated by Admin'
                time='45 minutes ago'
                type='info'
              />
              <ActivityItem
                title='Temperature Alert'
                description='Server Room temperature exceeded threshold (28°C)'
                time='1 hour ago'
                type='error'
              />
              <ActivityItem
                title='Device Status Change'
                description='Office AC Unit is now offline'
                time='2 hours ago'
                type='warning'
              />
              <ActivityItem
                title='New Device Added'
                description='Data Center Cooling Unit was added to the system'
                time='4 hours ago'
                type='info'
              />
            </div>
            <div className='mt-4 text-center'>
              <button className='text-blue-500 text-sm hover:text-blue-700'>
                View full activity log
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Status Card Component
const StatusCard = ({
  title,
  value,
  icon,
  bgColor = 'bg-white',
  textColor = 'text-gray-800',
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}) => (
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

// Activity Item Component
const ActivityItem = ({
  title,
  description,
  time,
  type,
}: {
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'error';
}) => {
  const getBorderColor = () => {
    switch (type) {
      case 'error':
        return 'border-red-500';
      case 'warning':
        return 'border-amber-500';
      case 'info':
      default:
        return 'border-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={18} className='text-red-500' />;
      case 'warning':
        return <AlertCircle size={18} className='text-amber-500' />;
      case 'info':
      default:
        return <CheckCircle size={18} className='text-blue-500' />;
    }
  };

  return (
    <div className={`p-3 border-l-4 rounded-r-md ${getBorderColor()} bg-white`}>
      <div className='flex items-start'>
        <div className='mr-3 mt-0.5'>{getIcon()}</div>
        <div className='flex-1 min-w-0'>
          <div className='flex justify-between'>
            <p className='font-medium text-gray-800'>{title}</p>
            <span className='text-xs text-gray-500'>{time}</span>
          </div>
          <p className='text-sm text-gray-600'>{description}</p>
        </div>
      </div>
    </div>
  );
};

// Alert Item Component - New Component
const AlertItem = ({
  title,
  description,
  time,
  type,
  deviceId,
  status,
}: {
  title: string;
  description: string;
  time: string;
  type: 'critical' | 'warning' | 'info';
  deviceId: string;
  status: 'unresolved' | 'investigating' | 'resolved';
}) => {
  const getBgColor = () => {
    switch (type) {
      case 'critical':
        return 'bg-red-50';
      case 'warning':
        return 'bg-amber-50';
      case 'info':
      default:
        return 'bg-blue-50';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'critical':
        return <AlertCircle size={18} className='text-red-500' />;
      case 'warning':
        return <AlertCircle size={18} className='text-amber-500' />;
      case 'info':
      default:
        return <CheckCircle size={18} className='text-blue-500' />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'unresolved':
        return (
          <span className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'>
            Unresolved
          </span>
        );
      case 'investigating':
        return (
          <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>
            Investigating
          </span>
        );
      case 'resolved':
        return (
          <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`p-4 rounded-md ${getBgColor()}`}>
      <div className='flex items-start'>
        <div className='mr-3 mt-0.5'>{getIcon()}</div>
        <div className='flex-1 min-w-0'>
          <div className='flex flex-wrap justify-between'>
            <p className='font-medium text-gray-800'>{title}</p>
            <div className='flex items-center space-x-2'>
              {getStatusBadge()}
              <span className='text-xs text-gray-500'>{time}</span>
            </div>
          </div>
          <p className='text-sm text-gray-600 mt-1'>{description}</p>
          <div className='mt-2 flex justify-between items-center'>
            <span className='text-xs text-gray-500'>Device ID: {deviceId}</span>
            <div className='space-x-2'>
              <button className='px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50'>
                Details
              </button>
              <button className='px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600'>
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
