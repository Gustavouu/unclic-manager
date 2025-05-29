
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ClientAcquisitionChartProps {
  dateRange: string;
}

export function ClientAcquisitionChart({ dateRange }: ClientAcquisitionChartProps) {
  const data = [
    { name: 'Jan', novos: 8 },
    { name: 'Fev', novos: 12 },
    { name: 'Mar', novos: 15 },
    { name: 'Abr', novos: 10 },
    { name: 'Mai', novos: 18 },
    { name: 'Jun', novos: 22 },
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="novos" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ fill: '#3b82f6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
