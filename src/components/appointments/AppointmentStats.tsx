
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StandardizedAppointmentService } from '@/services/appointments/standardizedAppointmentService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { Calendar, Clock, DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  no_show: number;
  total_revenue: number;
  average_value: number;
  completion_rate: number;
  cancellation_rate: number;
}

export const AppointmentStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { businessId } = useCurrentBusiness();
  const appointmentService = StandardizedAppointmentService.getInstance();

  useEffect(() => {
    const fetchStats = async () => {
      if (!businessId) return;
      
      setIsLoading(true);
      try {
        // Get stats for the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        
        const statsData = await appointmentService.getStats(businessId, startOfMonth, endOfMonth);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [businessId, appointmentService]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Não foi possível carregar as estatísticas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statsCards = [
    {
      title: "Total de Agendamentos",
      value: stats.total.toString(),
      description: "Este mês",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Agendamentos Confirmados",
      value: (stats.confirmed + stats.scheduled).toString(),
      description: `${((stats.confirmed + stats.scheduled) / Math.max(stats.total, 1) * 100).toFixed(0)}% do total`,
      icon: Clock,
      color: "text-green-600",
    },
    {
      title: "Receita Total",
      value: `R$ ${stats.total_revenue.toFixed(2)}`,
      description: `Ticket médio: R$ ${stats.average_value.toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      title: "Taxa de Conclusão",
      value: `${stats.completion_rate.toFixed(1)}%`,
      description: `${stats.completed} agendamentos concluídos`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
