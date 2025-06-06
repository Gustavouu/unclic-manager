
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';
import { RevenueChartData } from '@/hooks/dashboard/useDashboardMetricsReal';

interface RevenueChartRealProps {
  data: RevenueChartData[];
  isLoading?: boolean;
  showTarget?: boolean;
  height?: number;
}

export const RevenueChartReal: React.FC<RevenueChartRealProps> = ({
  data,
  isLoading = false,
  showTarget = true,
  height = 300
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatTooltipCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução da Receita
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-[300px] bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução da Receita
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Nenhum dado de receita disponível</p>
              <p className="text-xs">Complete alguns agendamentos para ver o gráfico</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate growth percentage
  const currentMonth = data[data.length - 1]?.value || 0;
  const previousMonth = data[data.length - 2]?.value || 0;
  const growthPercentage = previousMonth > 0 ? 
    ((currentMonth - previousMonth) / previousMonth * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução da Receita
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Este mês</p>
            <p className="text-lg font-semibold">{formatCurrency(currentMonth)}</p>
            {growthPercentage !== 0 && (
              <p className={`text-xs ${growthPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growthPercentage > 0 ? '+' : ''}{growthPercentage.toFixed(1)}% vs mês anterior
              </p>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              {showTarget && (
                <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              )}
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ opacity: 0.3 }}
            />
            
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ opacity: 0.3 }}
              tickFormatter={formatCurrency}
            />
            
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === "Receita") return [formatTooltipCurrency(value), name];
                if (name === "Meta") return [formatTooltipCurrency(value), name];
                return [value, name];
              }}
              labelFormatter={(label) => `Mês: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            
            {showTarget && (
              <Area
                type="monotone"
                dataKey="target"
                stroke="#10b981"
                strokeWidth={1}
                strokeDasharray="5 5"
                fill="url(#targetGradient)"
                name="Meta"
              />
            )}
            
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              name="Receita"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total 6 meses</p>
            <p className="text-lg font-semibold">
              {formatCurrency(data.reduce((sum, item) => sum + item.value, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Média mensal</p>
            <p className="text-lg font-semibold">
              {formatCurrency(data.reduce((sum, item) => sum + item.value, 0) / data.length)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
