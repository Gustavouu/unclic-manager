
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProfessionalRevenueChartProps {
  dateRange: string;
}

const data = [
  { name: "Ana Silva", revenue: 12500 },
  { name: "Carlos Oliveira", revenue: 11200 },
  { name: "Mariana Santos", revenue: 9800 },
  { name: "Bruno Costa", revenue: 8500 },
  { name: "Juliana Lima", revenue: 7200 },
];

export function ProfessionalRevenueChart({ dateRange }: ProfessionalRevenueChartProps) {
  // In a real application, we would use the dateRange to filter data
  console.log(`Loading professional revenue data for range: ${dateRange}`);
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
        <Bar dataKey="revenue" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  );
}
