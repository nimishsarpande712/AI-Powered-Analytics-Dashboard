import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useColorMode } from '@chakra-ui/react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF5733'];

const DonutChart = ({ data, dataKey, nameKey, title }) => {
  const { colorMode } = useColorMode();
  const textColor = colorMode === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: textColor }}>{title}</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colorMode === 'dark' ? '#2D3748' : '#FFFFFF',
              color: textColor,
              borderColor: colorMode === 'dark' ? '#4A5568' : '#E2E8F0'
            }}
          />
          <Legend 
            formatter={(value) => <span style={{ color: textColor }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
