
import { 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

const data = [
  { name: 'Frequentes', value: 35 },
  { name: 'Regulares', value: 45 },
  { name: 'Ocasionais', value: 15 },
  { name: 'Novos', value: 5 },
];

export function ClientCategoriesChart() {
  const config = {
    Frequentes: {
      label: "Frequentes",
      theme: { light: "#4f46e5", dark: "#818cf8" },
    },
    Regulares: {
      label: "Regulares",
      theme: { light: "#10b981", dark: "#34d399" },
    },
    Ocasionais: {
      label: "Ocasionais",
      theme: { light: "#f59e0b", dark: "#fbbf24" },
    },
    Novos: {
      label: "Novos",
      theme: { light: "#ec4899", dark: "#f472b6" },
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
