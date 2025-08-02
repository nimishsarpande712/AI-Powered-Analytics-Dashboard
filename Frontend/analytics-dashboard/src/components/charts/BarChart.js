import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useColorMode } from '@chakra-ui/react';

const BarChart = ({ data, dataKey, xAxisKey, title }) => {
  const { colorMode } = useColorMode();
  const textColor = colorMode === 'dark' ? '#FFFFFF' : '#000000';
  const gridColor = colorMode === 'dark' ? '#4A5568' : '#E2E8F0';
  const barColor = colorMode === 'dark' ? '#63B3ED' : '#3182CE';

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: textColor }}>{title}</h3>
      <ResponsiveContainer>
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xAxisKey} tick={{ fill: textColor }} />
          <YAxis tick={{ fill: textColor }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colorMode === 'dark' ? '#2D3748' : '#FFFFFF',
              color: textColor,
              borderColor: colorMode === 'dark' ? '#4A5568' : '#E2E8F0'
            }}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <Bar dataKey={dataKey} fill={barColor} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
