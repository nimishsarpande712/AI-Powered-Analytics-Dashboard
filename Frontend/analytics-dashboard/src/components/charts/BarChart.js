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
import { useColorMode, useTheme } from '@chakra-ui/react';

const BarChart = ({ data, xDataKey, barDataKey, title, colorMode: propColorMode }) => {
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
  const barColor = effectiveColorMode === 'dark' ? theme.colors.blue[300] : theme.colors.blue[500];
  const backgroundColor = effectiveColorMode === 'dark' ? '#2D3748' : '#FFFFFF';
  const borderColor = effectiveColorMode === 'dark' ? '#4A5568' : '#E2E8F0';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey={xDataKey} 
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
        <Bar dataKey={barDataKey} fill={barColor} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
