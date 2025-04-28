import {
  Activity,
  AlertCircle,
  BarChart,
  CheckCircle,
  Clock,
  HardDrive,
  Thermometer,
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

const Dashboard: React.FC = () => {
  const [deviceStats, setDeviceStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
  });
  const [temperatureData, setTemperatureData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock API call to fetch device statistics and temperature data
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
  }, []);

  // For device status pie chart
  const deviceStatusData = [
    { name: 'Online', value: deviceStats.online, color: '#10b981' }, // green
    { name: 'Offline', value: deviceStats.offline, color: '#ef4444' }, // red
  ];

  // Last updated time
  const lastUpdated = new Date().toLocaleTimeString();

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Dashboard</h1>
        <div className='text-sm text-gray-500'>Last updated: {lastUpdated}</div>
      </div>

      {isLoading ? (
        <div className='animate-pulse p-8 text-center text-gray-500'>
          <BarChart className='mx-auto mb-4' size={32} />
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Status Cards */}
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

          {/* Charts */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Temperature Chart */}
            <div className='bg-white rounded-lg shadow-sm p-4 lg:col-span-2'>
              <h2 className='text-lg font-semibold mb-4 flex items-center'>
                <Thermometer className='mr-2 text-blue-500' size={20} />
                Temperature Trends
              </h2>
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
              <h2 className='text-lg font-semibold mb-4 flex items-center'>
                <Activity className='mr-2 text-blue-500' size={20} />
                Device Status
              </h2>
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

          {/* Recent Activity */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <h2 className='text-lg font-semibold mb-4 flex items-center'>
              <Clock className='mr-2 text-blue-500' size={20} />
              Recent Activity
            </h2>
            <div className='space-y-4'>
              <ActivityItem
                title='Temperature Alert'
                description='Server Room temperature exceeded threshold (28°C)'
                time='15 minutes ago'
                type='error'
              />
              <ActivityItem
                title='Device Status Change'
                description='Office AC Unit is now offline'
                time='1 hour ago'
                type='warning'
              />
              <ActivityItem
                title='New Device Added'
                description='Data Center Cooling Unit was added to the system'
                time='3 hours ago'
                type='info'
              />
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

export default Dashboard;
