
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ServicePopularityChartProps {
  dateRange: string;
}

const data = [
  { name: "Corte de Cabelo", count: 150 },
  { name: "Coloração", count: 120 },
  { name: "Manicure", count: 100 },
  { name: "Pedicure", count: 80 },
  { name: "Tratamento Facial", count: 60 },
];

export function ServicePopularityChart({ dateRange }: ServicePopularityChartProps) {
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
