
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';

export const DashboardMetricsUnified: React.FC = () => {
  const { metrics, isLoading, error, formatCurrency } = useDashboardMetrics();

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-4">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Erro ao carregar métricas: {error}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Verifique sua conexão e tente novamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Agendamentos do Mês",
      value: metrics.totalAppointments,
      icon: Calendar,
      description: `${metrics.completedAppointments} concluídos`,
      trend: metrics.growthRate > 0 ? `+${metrics.growthRate}%` : undefined
    },
    {
      title: "Total de Clientes",
      value: metrics.totalClients,
      icon: Users,
      description: `${metrics.activeClients} ativos`,
      highlight: metrics.newClientsThisMonth > 0 ? `+${metrics.newClientsThisMonth} novos` : undefined
    },
    {
      title: "Receita do Mês",
      value: formatCurrency(metrics.monthlyRevenue),
      icon: DollarSign,
      description: `Ticket médio: ${formatCurrency(metrics.averageTicket)}`,
      isMonetary: true
    },
    {
      title: "Agendamentos Hoje",
      value: metrics.todayAppointments,
      icon: Clock,
      description: `${metrics.pendingAppointments} pendentes`,
      urgent: metrics.todayAppointments > 0
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className={card.urgent ? 'border-orange-200 bg-orange-50/50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.urgent ? 'text-orange-600' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.isMonetary 
                  ? card.value 
                  : typeof card.value === 'number' 
                    ? card.value.toLocaleString('pt-BR') 
                    : card.value
                }
                {card.trend && (
                  <span className="text-sm text-green-600 ml-2">
                    {card.trend}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.highlight ? (
                  <span className="text-green-600 font-medium">{card.highlight}</span>
                ) : (
                  card.description
                )}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
