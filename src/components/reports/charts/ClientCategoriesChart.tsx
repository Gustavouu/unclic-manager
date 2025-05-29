
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ClientCategoriesChartProps {
  dateRange: string;
}

export function ClientCategoriesChart({ dateRange }: ClientCategoriesChartProps) {
  const data = [
    { category: 'VIP', count: 12, revenue: 8500 },
    { category: 'Frequente', count: 28, revenue: 15200 },
    { category: 'Regular', count: 35, revenue: 12800 },
    { category: 'Novo', count: 18, revenue: 4200 },
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [
            name === 'count' ? `${value} clientes` : `R$ ${value}`,
            name === 'count' ? 'Quantidade' : 'Receita'
          ]}
        />
        <Bar dataKey="count" fill="#3b82f6" name="count" />
      </BarChart>
    </ResponsiveContainer>
  );
}
