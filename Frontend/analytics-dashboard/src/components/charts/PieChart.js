import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useColorMode } from '@chakra-ui/react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF5733'];

const PieChart = ({ data, dataKey, nameKey, title }) => {
  const { colorMode } = useColorMode();
  const textColor = colorMode === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: textColor }}>{title}</h3>
      <ResponsiveContainer>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label={{ fill: textColor }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
