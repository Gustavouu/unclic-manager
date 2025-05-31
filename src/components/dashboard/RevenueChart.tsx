
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '@/types/dashboard';

interface RevenueChartProps {
  data: ChartData[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Receita']}
          labelFormatter={(label) => `Data: ${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#8884d8" 
          strokeWidth={2}
          dot={{ fill: '#8884d8' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
