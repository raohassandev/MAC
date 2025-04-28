import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEffect, useState } from 'react';

const TemperatureChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // In a real app, this would come from an API
    // Generating sample data for demonstration
    const now = new Date();
    const sampleData = Array.from({ length: 24 }, (_, i) => {
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

    setData(sampleData);
  }, []);

  return (
    <div className='h-64'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={data}
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
  );
};

export default TemperatureChart;
