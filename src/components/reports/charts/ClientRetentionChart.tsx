
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

interface ClientRetentionChartProps {
  dateRange: string;
}

const data = [
  { name: 'Jan', taxa: 78 },
  { name: 'Fev', taxa: 80 },
  { name: 'Mar', taxa: 82 },
  { name: 'Abr', taxa: 85 },
  { name: 'Mai', taxa: 83 },
  { name: 'Jun', taxa: 87 },
];

export function ClientRetentionChart({ dateRange }: ClientRetentionChartProps) {
  // In a real application, we would use the dateRange to filter data
  console.log(`Loading client retention data for range: ${dateRange}`);
  
  const config = {
    taxa: {
      label: "Taxa de Retenção",
      theme: { light: "#10b981", dark: "#34d399" },
    },
  };

  return (
    <ChartContainer config={config} className="h-[300px]">
      <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          width={30}
          domain={[70, 90]}
          tickFormatter={(value) => `${value}%`}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={(value: number) => `${value}%`} />} />
        <Line 
          type="monotone" 
          dataKey="taxa" 
          stroke="var(--color-taxa)" 
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
