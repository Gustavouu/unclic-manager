
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
  { name: 'Ana Silva', atendimentos: 95 },
  { name: 'João Pereira', atendimentos: 85 },
  { name: 'Maria Oliveira', atendimentos: 78 },
  { name: 'Carlos Santos', atendimentos: 62 },
  { name: 'Paula Souza', atendimentos: 45 },
];

export function ProfessionalProductivityChart() {
  const config = {
    atendimentos: {
      label: "Atendimentos",
      theme: { light: "#4f46e5", dark: "#818cf8" },
    },
  };

  return (
    <ChartContainer config={config} className="h-[300px]">
      <BarChart 
        layout="vertical" 
        data={data} 
        margin={{ top: 10, right: 10, left: 90, bottom: 10 }}
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
          width={80}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar 
          dataKey="atendimentos" 
          fill="var(--color-atendimentos)" 
          barSize={20} 
          radius={[0, 4, 4, 0]} 
        />
      </BarChart>
    </ChartContainer>
  );
}
