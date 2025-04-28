import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface DeviceStatusChartProps {
  online: number;
  offline: number;
}

const DeviceStatusChart = ({ online, offline }: DeviceStatusChartProps) => {
  const data = [
    { name: 'Online', value: online, color: '#10b981' }, // green
    { name: 'Offline', value: offline, color: '#ef4444' }, // red
  ];

  // Only show the chart if we have devices to display
  if (online + offline === 0) {
    return (
      <div className='flex items-center justify-center h-48 bg-gray-50 rounded'>
        <p className='text-gray-500'>No device data available</p>
      </div>
    );
  }

  return (
    <div className='h-48'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} devices`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeviceStatusChart;
