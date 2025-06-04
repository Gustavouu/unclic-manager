
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Scissors, UserCheck, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStatsProps {
  stats: {
    totalClients: number;
    totalServices: number;
    totalAppointments: number;
    totalRevenue: number;
    newClients: number;
    completionRate: number;
  };
  loading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const cards = [
    {
      title: "Total de Clientes",
      value: stats.totalClients,
      icon: Users,
      description: "clientes cadastrados"
    },
    {
      title: "Serviços Ativos",
      value: stats.totalServices,
      icon: Scissors,
      description: "serviços disponíveis"
    },
    {
      title: "Agendamentos",
      value: stats.totalAppointments,
      icon: Calendar,
      description: "no período"
    },
    {
      title: "Receita Total",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      description: "no período",
      isMonetary: true
    },
    {
      title: "Novos Clientes",
      value: stats.newClients,
      icon: UserCheck,
      description: "no período"
    },
    {
      title: "Taxa de Conclusão",
      value: `${stats.completionRate.toFixed(1)}%`,
      icon: TrendingUp,
      description: "dos agendamentos",
      isPercentage: true
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((_, index) => (
          <Card key={index}>
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                {card.isMonetary || card.isPercentage ? card.value : card.value.toLocaleString('pt-BR')}
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
