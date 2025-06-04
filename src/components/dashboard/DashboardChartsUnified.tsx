
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

export const DashboardChartsUnified: React.FC = () => {
  const { metrics, revenueData, popularServices, isLoading, error, formatCurrency } = useDashboardMetrics();

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Erro ao carregar gráficos: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const performanceMetrics = [
    {
      label: 'Taxa de Retenção',
      value: metrics.retentionRate,
      maxValue: 100,
      format: (val: number) => `${val}%`,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      label: 'Crescimento Mensal',
      value: metrics.growthRate,
      maxValue: 50,
      format: (val: number) => `+${val}%`,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      label: 'Ticket Médio',
      value: (metrics.averageTicket / 500) * 100, // Normalize to percentage for progress bar
      maxValue: 100,
      format: () => formatCurrency(metrics.averageTicket),
      icon: DollarSign,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Receita dos Últimos 6 Meses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `R$ ${value}`}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Receita']}
                  labelStyle={{ color: '#000' }}
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#213858" 
                  strokeWidth={3}
                  dot={{ fill: '#213858', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#213858', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>Dados de receita indisponíveis</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                  </div>
                  <span className="text-sm font-medium">{metric.format(metric.value)}</span>
                </div>
                <Progress 
                  value={Math.min(metric.value, metric.maxValue)} 
                  className="h-2"
                />
              </div>
            );
          })}

          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Serviços Populares
            </h4>
            {popularServices.slice(0, 3).map((service, index) => (
              <div key={index} className="flex justify-between items-center mb-2 py-1">
                <span className="text-sm">{service.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{service.count}</span>
                  <span className="text-xs text-gray-500">({service.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
            {popularServices.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                Nenhum serviço registrado ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
