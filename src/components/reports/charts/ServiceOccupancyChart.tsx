
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { hora: '08:00', segunda: 60, terca: 45, quarta: 55, quinta: 70, sexta: 80, sabado: 85 },
  { hora: '10:00', segunda: 75, terca: 65, quarta: 70, quinta: 80, sexta: 85, sabado: 95 },
  { hora: '12:00', segunda: 50, terca: 40, quarta: 45, quinta: 55, sexta: 60, sabado: 70 },
  { hora: '14:00', segunda: 85, terca: 70, quarta: 75, quinta: 80, sexta: 90, sabado: 90 },
  { hora: '16:00', segunda: 90, terca: 85, quarta: 80, quinta: 85, sexta: 95, sabado: 80 },
  { hora: '18:00', segunda: 65, terca: 70, quarta: 75, quinta: 80, sexta: 70, sabado: 60 },
];

export function ServiceOccupancyChart() {
  const config = {
    segunda: {
      label: "Segunda",
      theme: { light: "#4f46e5", dark: "#818cf8" },
    },
    terca: {
      label: "Terça",
      theme: { light: "#ec4899", dark: "#f472b6" },
    },
    quarta: {
      label: "Quarta",
      theme: { light: "#10b981", dark: "#34d399" },
    },
    quinta: {
      label: "Quinta",
      theme: { light: "#f59e0b", dark: "#fbbf24" },
    },
    sexta: {
      label: "Sexta",
      theme: { light: "#06b6d4", dark: "#22d3ee" },
    },
    sabado: {
      label: "Sábado",
      theme: { light: "#8b5cf6", dark: "#a78bfa" },
    },
  };

  return (
    <ChartContainer config={config} className="h-[300px]">
      <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="hora" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          width={30}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={(value: number) => `${value}%`} />} />
        <Legend />
        <Line type="monotone" dataKey="segunda" stroke="var(--color-segunda)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="terca" stroke="var(--color-terca)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="quarta" stroke="var(--color-quarta)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="quinta" stroke="var(--color-quinta)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="sexta" stroke="var(--color-sexta)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="sabado" stroke="var(--color-sabado)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
