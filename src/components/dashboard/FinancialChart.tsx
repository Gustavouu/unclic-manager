
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialChartProps {
  data?: any[];
  businessId?: string;
}

export function FinancialChart({ data, businessId }: FinancialChartProps) {
  // Se recebemos dados diretamente, usamos eles
  // Caso contrário, tentamos usar o businessId (compatibilidade com código existente)
  const chartData = data || [
    { name: "Jan", receita: 4000, despesa: 2400 },
    { name: "Fev", receita: 3000, despesa: 1398 },
    { name: "Mar", receita: 2000, despesa: 9800 },
    { name: "Abr", receita: 2780, despesa: 3908 },
    { name: "Mai", receita: 1890, despesa: 4800 },
    { name: "Jun", receita: 2390, despesa: 3800 }
  ];

  if (!chartData) {
    return <Skeleton className="h-[250px] w-full" />;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis 
            tickFormatter={formatCurrency} 
            axisLine={false} 
            tickLine={false} 
            width={80}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value)]} 
            labelFormatter={(value) => `${value}`}
            contentStyle={{ 
              borderRadius: '8px',
              backgroundColor: 'white', 
              borderColor: '#e2e8f0'
            }}
          />
          <Legend />
          <Bar 
            dataKey="receita" 
            name="Receita" 
            fill="#22c55e" 
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          <Bar 
            dataKey="despesa" 
            name="Despesa" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
