
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
  { name: 'Ana Silva', receita: 9500 },
  { name: 'João Pereira', receita: 8200 },
  { name: 'Maria Oliveira', receita: 7800 },
  { name: 'Carlos Santos', receita: 5600 },
  { name: 'Paula Souza', receita: 4200 },
];

export function ProfessionalRevenueChart() {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const config = {
    receita: {
      label: "Receita",
      theme: { light: "#10b981", dark: "#34d399" },
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
          tickFormatter={(value) => `R$ ${value/1000}k`}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          width={80}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={(value: number) => formatCurrency(value)} />} />
        <Bar 
          dataKey="receita" 
          fill="var(--color-receita)" 
          barSize={20} 
          radius={[0, 4, 4, 0]} 
        />
      </BarChart>
    </ChartContainer>
  );
}
