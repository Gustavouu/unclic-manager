
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface SalesDistributionChartProps {
  dateRange: string;
}

export function SalesDistributionChart({ dateRange }: SalesDistributionChartProps) {
  const data = [
    { name: 'Cortes', value: 45, color: '#3b82f6' },
    { name: 'Barba', value: 25, color: '#10b981' },
    { name: 'Tratamentos', value: 20, color: '#f59e0b' },
    { name: 'Produtos', value: 10, color: '#ef4444' },
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label={({ name, value }) => `${value}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
