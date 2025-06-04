
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';

export const DashboardChartsUnified: React.FC = () => {
  const { metrics, revenueData, popularServices, isLoading, formatCurrency } = useDashboardMetrics();

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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Receita dos Últimos 6 Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `R$ ${value}`} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Receita']}
                labelStyle={{ color: '#000' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#213858" 
                strokeWidth={2}
                dot={{ fill: '#213858', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#213858', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Taxa de Retenção</span>
              <span className="text-sm font-medium">{metrics.retentionRate}%</span>
            </div>
            <Progress value={metrics.retentionRate} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Ticket Médio</span>
              <span className="text-sm font-medium">{formatCurrency(metrics.averageTicket)}</span>
            </div>
            <Progress value={Math.min((metrics.averageTicket / 200) * 100, 100)} className="h-2" />
          </div>

          <div className="pt-4">
            <h4 className="text-sm font-semibold mb-3">Serviços Populares</h4>
            {popularServices.slice(0, 3).map((service, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <span className="text-sm">{service.name}</span>
                <span className="text-sm text-muted-foreground">{service.count} agendamentos</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
