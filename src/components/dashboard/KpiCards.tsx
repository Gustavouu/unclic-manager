
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { DashboardStats, FilterPeriod } from '@/types/dashboard';

interface KpiCardsProps {
  stats: DashboardStats;
  period: FilterPeriod;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ stats, period }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const kpis = [
    {
      title: 'Agendamentos Hoje',
      value: stats.todayAppointments || 0,
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(stats.monthlyRevenue || 0),
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Serviços do Mês',
      value: stats.monthlyServices || stats.totalAppointments || 0,
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Novos Clientes',
      value: stats.newClients || stats.newClientsCount || 0,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {kpi.title}
            </CardTitle>
            {kpi.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
