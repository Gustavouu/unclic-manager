
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ServiceOccupancyChartProps {
  dateRange: string;
}

export function ServiceOccupancyChart({ dateRange }: ServiceOccupancyChartProps) {
  const data = [
    { name: '08:00', ocupacao: 45 },
    { name: '09:00', ocupacao: 65 },
    { name: '10:00', ocupacao: 80 },
    { name: '11:00', ocupacao: 75 },
    { name: '14:00', ocupacao: 85 },
    { name: '15:00', ocupacao: 90 },
    { name: '16:00', ocupacao: 70 },
    { name: '17:00', ocupacao: 60 },
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          formatter={(value) => [`${value}%`, 'Ocupação']}
        />
        <Bar dataKey="ocupacao" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
