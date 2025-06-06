
import React from 'react';
import { Calendar, Users, DollarSign, Clock, TrendingUp, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';
import { MetricCardPremium } from './MetricCardPremium';
import type { UseDashboardMetricsReturn } from '@/hooks/dashboard/types';

export const DashboardMetricsUnified: React.FC = () => {
  const { metrics, isLoading, error, formatCurrency }: UseDashboardMetricsReturn = useDashboardMetrics();

  if (error) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="md:col-span-4 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-center text-red-600">
            <p className="font-semibold">Erro ao carregar métricas</p>
            <p className="text-sm mt-2">{error}</p>
            <p className="text-xs text-red-500 mt-1">
              Verifique sua conexão e tente novamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-lg animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-16" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
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
      trend: metrics.growthRate > 0 ? {
        value: metrics.growthRate,
        isPositive: true,
        label: 'vs mês anterior'
      } : undefined,
      gradient: 'blue' as const
    },
    {
      title: "Total de Clientes",
      value: metrics.totalClients,
      icon: Users,
      description: `${metrics.activeClients} ativos`,
      trend: metrics.newClientsThisMonth > 0 ? {
        value: metrics.newClientsThisMonth,
        isPositive: true,
        label: 'novos este mês'
      } : undefined,
      gradient: 'green' as const
    },
    {
      title: "Receita do Mês",
      value: formatCurrency(metrics.monthlyRevenue),
      icon: DollarSign,
      description: `Ticket médio: ${formatCurrency(metrics.averageTicket)}`,
      trend: {
        value: 12.5,
        isPositive: true,
        label: 'vs mês anterior'
      },
      gradient: 'purple' as const
    },
    {
      title: "Agendamentos Hoje",
      value: metrics.todayAppointments,
      icon: Clock,
      description: `${metrics.pendingAppointments} pendentes`,
      gradient: metrics.todayAppointments > 0 ? 'orange' as const : 'pink' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe as principais métricas do seu negócio
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>Atualizado agora</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div key={index} className={`animate-reveal stagger-${index + 1}`}>
            <MetricCardPremium
              title={card.title}
              value={card.value}
              icon={card.icon}
              description={card.description}
              trend={card.trend}
              gradient={card.gradient}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
