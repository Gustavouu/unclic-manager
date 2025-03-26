
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface PaymentMethodsChartProps {
  dateRange: string;
}

const data = [
  { name: 'Cartão de Crédito', valor: 45 },
  { name: 'Cartão de Débito', valor: 25 },
  { name: 'Dinheiro', valor: 15 },
  { name: 'Pix', valor: 12 },
  { name: 'Outros', valor: 3 },
];

export function PaymentMethodsChart({ dateRange }: PaymentMethodsChartProps) {
  // In a real application, we would use the dateRange to filter data
  console.log(`Loading payment methods data for range: ${dateRange}`);
  
  const config = {
    valor: {
      label: "Percentual",
      theme: { light: "#4f46e5", dark: "#818cf8" },
    },
  };

  return (
    <ChartContainer config={config} className="h-[300px]">
      <BarChart 
        layout="vertical" 
        data={data}
        margin={{ top: 10, right: 30, left: 110, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis 
          type="number" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          width={100}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={(value: number) => `${value}%`} />} />
        <Bar dataKey="valor" fill="var(--color-valor)" barSize={20} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
