import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useColorMode, useTheme } from '@chakra-ui/react';

const LineChart = ({ data, dataKey, xAxisKey, title, colorMode: propColorMode }) => {
  const { colorMode: contextColorMode } = useColorMode();
  const theme = useTheme();
  
  // Allow colorMode to be passed as prop or use context
  const effectiveColorMode = propColorMode || contextColorMode;
  
  // Check if data exists and is valid
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        color: effectiveColorMode === 'dark' ? '#FFFFFF' : '#000000'
      }}>
        No data available
      </div>
    );
  }
  
  const textColor = effectiveColorMode === 'dark' ? '#FFFFFF' : '#000000';
  const gridColor = effectiveColorMode === 'dark' ? '#4A5568' : '#E2E8F0';
  const lineColor = effectiveColorMode === 'dark' ? theme.colors.blue[300] : theme.colors.blue[500];
  const backgroundColor = effectiveColorMode === 'dark' ? '#2D3748' : '#FFFFFF';
  const borderColor = effectiveColorMode === 'dark' ? '#4A5568' : '#E2E8F0';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fill: textColor }}
          tickLine={{ stroke: textColor }}
          axisLine={{ stroke: textColor }}
        />
        <YAxis 
          tick={{ fill: textColor }}
          tickLine={{ stroke: textColor }}
          axisLine={{ stroke: textColor }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: backgroundColor,
            color: textColor,
            borderColor: borderColor
          }}
        />
        <Legend 
          formatter={(value) => <span style={{ color: textColor }}>{value}</span>} 
          wrapperStyle={{ color: textColor }}
        />
        <Line type="monotone" dataKey={dataKey} stroke={lineColor} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
