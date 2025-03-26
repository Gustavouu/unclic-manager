
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

interface RevenueChartProps {
  dateRange: string;
}

const data = [
  { name: 'Jan', receita: 4500, despesa: 2300 },
  { name: 'Fev', receita: 5200, despesa: 2500 },
  { name: 'Mar', receita: 4800, despesa: 2400 },
  { name: 'Abr', receita: 6000, despesa: 2700 },
  { name: 'Mai', receita: 5500, despesa: 2500 },
  { name: 'Jun', receita: 6800, despesa: 2900 },
];

export function RevenueChart({ dateRange }: RevenueChartProps) {
  // In a real application, we would use the dateRange to filter data
  console.log(`Loading revenue data for range: ${dateRange}`);
  
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
