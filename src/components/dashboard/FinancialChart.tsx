
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useFinancialData } from "@/hooks/finance/useFinancialData";

interface FinancialChartProps {
  data?: any[];
  businessId?: string;
}

export function FinancialChart({ data, businessId }: FinancialChartProps) {
  const { chartData, isLoading, error } = useFinancialData();

  // Se dados foram passados como prop, usar eles (compatibilidade com código existente)
  const finalData = data || chartData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <div className="space-y-3 w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="text-sm text-muted-foreground text-center mt-4">
            Carregando dados financeiros...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="font-medium">Erro ao carregar dados</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!finalData || finalData.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="font-medium">Nenhum dado financeiro encontrado</p>
          <p className="text-sm mt-1">
            Adicione transações para visualizar o gráfico
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={finalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
