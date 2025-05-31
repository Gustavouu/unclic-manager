
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DashboardStats } from '@/types/dashboard';

interface DashboardInsightsProps {
  stats: DashboardStats;
}

export const DashboardInsights: React.FC<DashboardInsightsProps> = ({ stats }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Performance Financeira</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Receita do Mês</span>
              <span className="text-sm font-medium">
                {formatCurrency(stats.monthlyRevenue || stats.totalRevenue || 0)}
              </span>
            </div>
            <Progress 
              value={Math.min((stats.monthlyRevenue || stats.totalRevenue || 0) / 10000 * 100, 100)} 
              className="h-2" 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Taxa de Retenção</span>
              <span className="text-sm font-medium">{stats.retentionRate || 0}%</span>
            </div>
            <Progress value={stats.retentionRate || 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Serviços Populares</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.popularServices && stats.popularServices.length > 0 ? (
            <div className="space-y-3">
              {stats.popularServices.slice(0, 3).map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{service.name}</span>
                  <span className="text-sm text-muted-foreground">{service.count} agendamentos</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              Novos clientes: {stats.newClients || stats.newClientsCount || 0}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
