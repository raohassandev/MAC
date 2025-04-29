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

import React from 'react';

interface DataPoint {
  time: string;
  temperature: number;
}

interface TemperatureChartProps {
  data: DataPoint[];
  title?: string;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({
  data = [],
  title = 'Temperature Over Time',
}) => {
  if (!data || data.length === 0) {
    return <div>No temperature data available</div>;
  }

  return (
    <div className='chart-container'>
      <h3>{title}</h3>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='time' />
          <YAxis unit='°C' />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey='temperature'
            stroke='#8884d8'
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
