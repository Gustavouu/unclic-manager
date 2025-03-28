
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
import { ReportStatistics } from "@/hooks/reports/useReportsData";

interface RevenueChartProps {
  dateRange: string;
  stats: ReportStatistics;
}

export function RevenueChart({ dateRange, stats }: RevenueChartProps) {
  const data = stats.monthlyRevenue;
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const config = {
    receita: {
      label: "Receita",
      theme: { light: "#4f46e5", dark: "#818cf8" },
    },
    despesa: {
      label: "Despesa",
      theme: { light: "#f43f5e", dark: "#fb7185" },
    },
  };

  return (
    <ChartContainer config={config} className="h-[300px]">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          tickFormatter={(value) => `R$ ${value/1000}k`}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          width={60}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={(value: number) => formatCurrency(value)} />} />
        <Bar dataKey="receita" fill="var(--color-receita)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="despesa" fill="var(--color-despesa)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
