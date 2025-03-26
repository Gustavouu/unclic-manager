
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { name: 'Corte', agendamentos: 180 },
  { name: 'Coloração', agendamentos: 120 },
  { name: 'Manicure', agendamentos: 85 },
  { name: 'Pedicure', agendamentos: 75 },
  { name: 'Tratamento', agendamentos: 60 },
];

export function ServicePopularityChart() {
  const config = {
    agendamentos: {
      label: "Agendamentos",
      theme: { light: "#4f46e5", dark: "#818cf8" },
    },
  };

  return (
    <ChartContainer config={config} className="h-[300px]">
      <BarChart 
        layout="vertical" 
        data={data} 
        margin={{ top: 10, right: 10, left: 80, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis 
          type="number" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          width={70}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar 
          dataKey="agendamentos" 
          fill="var(--color-agendamentos)" 
          barSize={20} 
          radius={[0, 4, 4, 0]} 
        />
      </BarChart>
    </ChartContainer>
  );
}
