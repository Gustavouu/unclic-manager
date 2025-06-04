
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';

export const DashboardStats: React.FC = () => {
  const { metrics, isLoading, formatCurrency } = useDashboardMetrics();

  const statsCards = [
    {
      title: "Agendamentos Hoje",
      value: metrics.todayAppointments,
      subtitle: `${metrics.pendingAppointments} pendentes`,
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      urgent: metrics.todayAppointments > 10
    },
    {
      title: "Total de Clientes",
      value: metrics.totalClients,
      subtitle: `${metrics.newClientsThisMonth} novos este mês`,
      icon: <Users className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: metrics.newClientsThisMonth > 0 ? `+${metrics.newClientsThisMonth}` : undefined
    },
    {
      title: "Receita Mensal",
      value: formatCurrency(metrics.monthlyRevenue),
      subtitle: `Ticket médio: ${formatCurrency(metrics.averageTicket)}`,
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      isMonetary: true,
      trend: metrics.growthRate > 0 ? `+${metrics.growthRate.toFixed(1)}%` : undefined
    },
    {
      title: "Serviços Realizados",
      value: metrics.servicesCompleted,
      subtitle: `Taxa de conclusão: ${((metrics.completedAppointments / metrics.totalAppointments) * 100).toFixed(1)}%`,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Taxa de Retenção",
      value: `${metrics.retentionRate.toFixed(1)}%`,
      subtitle: `${metrics.activeClients} clientes ativos`,
      icon: <Star className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Crescimento",
      value: `+${metrics.growthRate.toFixed(1)}%`,
      subtitle: "Comparado ao mês anterior",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      trend: metrics.growthRate > 0 ? "positive" : "negative"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsCards.map((card, index) => (
        <Card key={index} className={`${card.urgent ? 'border-orange-200 bg-orange-50/50' : ''} hover:shadow-lg transition-shadow`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <span className={card.color}>{card.icon}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              {card.trend && (
                <Badge variant="secondary" className="text-xs">
                  {card.trend}
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {card.subtitle}
            </p>
            {card.urgent && (
              <div className="flex items-center mt-2 text-xs text-orange-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>Alta demanda hoje</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
