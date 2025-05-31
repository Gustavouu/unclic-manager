
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  className = "",
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && <div className="text-gray-500">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {(subtitle || trendValue) && (
          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
            {trend && trendValue && (
              <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>{trendValue}</span>
              </div>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  stats: {
    totalAppointments: number;
    totalRevenue: number;
    newClients: number;
    completionRate: number;
  };
  loading?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading = false }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-16 bg-gray-200" />
            <CardContent className="h-20 bg-gray-100" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total de Agendamentos"
        value={stats.totalAppointments}
        subtitle="este mês"
        trend="up"
        trendValue="+12%"
      />
      
      <StatsCard
        title="Receita Total"
        value={formatCurrency(stats.totalRevenue)}
        subtitle="este mês"
        trend="up"
        trendValue="+8%"
      />
      
      <StatsCard
        title="Novos Clientes"
        value={stats.newClients}
        subtitle="este mês"
        trend="up"
        trendValue="+15%"
      />
      
      <StatsCard
        title="Taxa de Conclusão"
        value={`${stats.completionRate.toFixed(1)}%`}
        subtitle="dos agendamentos"
        trend={stats.completionRate > 85 ? 'up' : stats.completionRate < 70 ? 'down' : 'neutral'}
        trendValue={stats.completionRate > 85 ? '+2%' : stats.completionRate < 70 ? '-3%' : '0%'}
      />
    </div>
  );
};
