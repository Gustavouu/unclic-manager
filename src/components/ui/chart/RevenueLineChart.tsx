
import React from 'react';
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RevenueChartData } from '@/hooks/payment/useFinancialMetrics';

interface RevenueLineChartProps {
  data: RevenueChartData[];
  className?: string;
  showSubscriptions?: boolean;
}

export const RevenueLineChart: React.FC<RevenueLineChartProps> = ({
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
      <LineChart
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
          yAxisId="left"
        />
        {showSubscriptions && (
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ opacity: 0.3 }}
            orientation="right"
            yAxisId="right"
          />
        )}
        <Tooltip 
          formatter={(value: number, name: string) => {
            if (name === "Receita") return [`R$ ${value.toLocaleString()}`, name];
            return [value, name];
          }}
          labelFormatter={(label) => `Período: ${label}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          name="Receita" 
          stroke="var(--color-primary, #3b82f6)" 
          activeDot={{ r: 8 }}
          yAxisId="left"
        />
        {showSubscriptions && (
          <Line 
            type="monotone" 
            dataKey="subscriptions" 
            name="Assinaturas" 
            stroke="var(--color-secondary, #22c55e)" 
            yAxisId="right"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};
