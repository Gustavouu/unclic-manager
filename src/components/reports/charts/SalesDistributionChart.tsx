
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

interface SalesDistributionChartProps {
  dateRange: string;
}

const data = [
  { name: 'Corte', value: 35 },
  { name: 'Coloração', value: 25 },
  { name: 'Tratamento', value: 20 },
  { name: 'Manicure', value: 15 },
  { name: 'Outros', value: 5 },
];

export function SalesDistributionChart({ dateRange }: SalesDistributionChartProps) {
  // In a real application, we would use the dateRange to filter data
  console.log(`Loading sales distribution data for range: ${dateRange}`);
  
  const config = {
    Corte: {
      label: "Corte",
      theme: { light: "#4f46e5", dark: "#818cf8" },
    },
    Coloração: {
      label: "Coloração",
      theme: { light: "#ec4899", dark: "#f472b6" },
    },
    Tratamento: {
      label: "Tratamento",
      theme: { light: "#0ea5e9", dark: "#38bdf8" },
    },
    Manicure: {
      label: "Manicure",
      theme: { light: "#10b981", dark: "#34d399" },
    },
    Outros: {
      label: "Outros",
      theme: { light: "#f59e0b", dark: "#fbbf24" },
    },
  };

  return (
    <ChartContainer config={config} className="h-[300px]">
      <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent formatter={(value: number) => `${value}%`} />} />
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  );
}
