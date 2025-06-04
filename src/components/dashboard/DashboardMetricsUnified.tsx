
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, TrendingUp, Clock, UserCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';

export const DashboardMetricsUnified: React.FC = () => {
  const { metrics, isLoading, formatCurrency } = useDashboardMetrics();

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
      description: "agendamentos este mês"
    },
    {
      title: "Total de Clientes",
      value: metrics.totalClients,
      icon: Users,
      description: "clientes cadastrados"
    },
    {
      title: "Receita do Mês",
      value: formatCurrency(metrics.monthlyRevenue),
      icon: DollarSign,
      description: "receita mensal",
      isMonetary: true
    },
    {
      title: "Taxa de Crescimento",
      value: `+${metrics.growthRate}%`,
      icon: TrendingUp,
      description: "em relação ao mês anterior",
      isPercentage: true
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.isMonetary || card.isPercentage 
                  ? card.value 
                  : typeof card.value === 'number' 
                    ? card.value.toLocaleString('pt-BR') 
                    : card.value
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
