
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ClientRetentionChartProps {
  dateRange: string;
}

export function ClientRetentionChart({ dateRange }: ClientRetentionChartProps) {
  const data = [
    { name: 'Clientes Fiéis', value: 65, color: '#22c55e' },
    { name: 'Clientes Ocasionais', value: 25, color: '#f59e0b' },
    { name: 'Clientes Únicos', value: 10, color: '#ef4444' },
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
