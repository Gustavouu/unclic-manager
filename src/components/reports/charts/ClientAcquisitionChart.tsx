
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { name: 'Jan', novosClientes: 28 },
  { name: 'Fev', novosClientes: 32 },
  { name: 'Mar', novosClientes: 36 },
  { name: 'Abr', novosClientes: 30 },
  { name: 'Mai', novosClientes: 40 },
  { name: 'Jun', novosClientes: 42 },
];

export function ClientAcquisitionChart() {
  const config = {
    novosClientes: {
      label: "Novos Clientes",
      theme: { light: "#4f46e5", dark: "#818cf8" },
    },
  };

  return (
    <ChartContainer config={config} className="h-[300px]">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <defs>
          <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-novosClientes)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--color-novosClientes)" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
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
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area 
          type="monotone" 
          dataKey="novosClientes" 
          stroke="var(--color-novosClientes)" 
          fillOpacity={1} 
          fill="url(#colorClients)" 
        />
      </AreaChart>
    </ChartContainer>
  );
}
