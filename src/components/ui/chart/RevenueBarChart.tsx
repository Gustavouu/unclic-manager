
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RevenueChartData } from '@/hooks/payment/useFinancialMetrics';

interface RevenueBarChartProps {
  data: RevenueChartData[];
  className?: string;
  showSubscriptions?: boolean;
}

export const RevenueBarChart: React.FC<RevenueBarChartProps> = ({
  data,
  className = 'w-full h-[300px]',
  showSubscriptions = true
}) => {
  if (!data?.length) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">Não há dados disponíveis</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis 
          dataKey="month"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ opacity: 0.3 }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ opacity: 0.3 }}
          tickFormatter={(value) => `R$ ${value}`}
        />
        <Tooltip 
          formatter={(value: number) => [`R$ ${value.toLocaleString()}`, 'Receita']}
          labelFormatter={(label) => `Período: ${label}`}
        />
        <Legend />
        <Bar 
          dataKey="revenue" 
          name="Receita" 
          fill="var(--color-primary, #3b82f6)" 
          radius={[4, 4, 0, 0]}
        />
        {showSubscriptions && (
          <Bar 
            dataKey="subscriptions" 
            name="Assinaturas" 
            fill="var(--color-secondary, #22c55e)" 
            radius={[4, 4, 0, 0]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};
