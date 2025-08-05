import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useColorMode, useTheme } from '@chakra-ui/react';

// Define theme-appropriate colors for the chart
const getChartColors = (colorMode, theme) => {
  if (colorMode === 'dark') {
    return [
      theme.colors.blue[300],
      theme.colors.green[300],
      theme.colors.yellow[300],
      theme.colors.orange[300],
      theme.colors.purple[300],
      theme.colors.red[300]
    ];
  } else {
    return [
      theme.colors.blue[500],
      theme.colors.green[500],
      theme.colors.yellow[500],
      theme.colors.orange[500],
      theme.colors.purple[500],
      theme.colors.red[500]
    ];
  }
};

const PieChart = ({ data, dataKey, nameKey, title, colorMode: propColorMode }) => {
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
  const backgroundColor = effectiveColorMode === 'dark' ? '#2D3748' : '#FFFFFF';
  const borderColor = effectiveColorMode === 'dark' ? '#4A5568' : '#E2E8F0';
  const COLORS = getChartColors(effectiveColorMode, theme);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={{ stroke: textColor }}
        >
          {data && data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: backgroundColor,
            color: textColor,
            borderColor: borderColor
          }}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: textColor }}>{value}</span>
          )}
          wrapperStyle={{ color: textColor }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
