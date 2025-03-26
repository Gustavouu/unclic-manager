
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProfessionalProductivityChartProps {
  dateRange: string;
}

const data = [
  { name: "Ana Silva", count: 125 },
  { name: "Carlos Oliveira", count: 115 },
  { name: "Mariana Santos", count: 98 },
  { name: "Bruno Costa", count: 87 },
  { name: "Juliana Lima", count: 75 },
];

export function ProfessionalProductivityChart({ dateRange }: ProfessionalProductivityChartProps) {
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
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
