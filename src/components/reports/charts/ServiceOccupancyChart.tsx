
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ServiceOccupancyChartProps {
  dateRange: string;
}

const data = [
  { time: "9h", segunda: 30, terca: 40, quarta: 45, quinta: 30, sexta: 50, sabado: 80 },
  { time: "10h", segunda: 50, terca: 60, quarta: 65, quinta: 55, sexta: 70, sabado: 90 },
  { time: "11h", segunda: 70, terca: 75, quarta: 80, quinta: 65, sexta: 85, sabado: 95 },
  { time: "12h", segunda: 40, terca: 45, quarta: 50, quinta: 40, sexta: 55, sabado: 60 },
  { time: "13h", segunda: 50, terca: 55, quarta: 60, quinta: 50, sexta: 65, sabado: 70 },
  { time: "14h", segunda: 80, terca: 85, quarta: 90, quinta: 80, sexta: 95, sabado: 100 },
  { time: "15h", segunda: 85, terca: 90, quarta: 95, quinta: 85, sexta: 100, sabado: 100 },
  { time: "16h", segunda: 70, terca: 75, quarta: 80, quinta: 70, sexta: 85, sabado: 90 },
  { time: "17h", segunda: 60, terca: 65, quarta: 70, quinta: 60, sexta: 75, sabado: 80 },
  { time: "18h", segunda: 40, terca: 45, quarta: 50, quinta: 40, sexta: 55, sabado: 60 },
];

export function ServiceOccupancyChart({ dateRange }: ServiceOccupancyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="segunda" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="terca" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="quarta" stackId="1" stroke="#ffc658" fill="#ffc658" />
        <Area type="monotone" dataKey="quinta" stackId="1" stroke="#ff8042" fill="#ff8042" />
        <Area type="monotone" dataKey="sexta" stackId="1" stroke="#0088fe" fill="#0088fe" />
        <Area type="monotone" dataKey="sabado" stackId="1" stroke="#00C49F" fill="#00C49F" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
