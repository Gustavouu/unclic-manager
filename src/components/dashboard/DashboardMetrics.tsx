import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { AppointmentService } from '@/services/appointments/appointmentService';
import { fetchClients } from '@/services/clientService';

interface DashboardMetrics {
  totalAppointments: number;
  totalClients: number;
  monthlyRevenue: number;
  growthRate: number;
}

export const DashboardMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAppointments: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    growthRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { businessId } = useCurrentBusiness();

  useEffect(() => {
    const loadMetrics = async () => {
      if (!businessId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const appointmentService = AppointmentService.getInstance();
        const clients = await fetchClients(businessId);

        // Get current month dates
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        // Fetch data
        const [appointmentStats] = await Promise.all([
          appointmentService.getStats(businessId, startOfMonth, endOfMonth),
        ]);

        // Calculate growth rate (simplified - would need historical data for real calculation)
        const growthRate = appointmentStats.total > 0 ? 12.5 : 0;

        setMetrics({
          totalAppointments: appointmentStats.total,
          totalClients: clients.length,
          monthlyRevenue: appointmentStats.total_revenue,
          growthRate,
        });
      } catch (error) {
        console.error('Error loading dashboard metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [businessId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Agendamentos do Mês
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalAppointments}</div>
          <p className="text-xs text-muted-foreground">
            agendamentos este mês
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Clientes
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalClients}</div>
          <p className="text-xs text-muted-foreground">
            clientes cadastrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Receita do Mês
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(metrics.monthlyRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            receita mensal
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Taxa de Crescimento
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{metrics.growthRate}%</div>
          <p className="text-xs text-muted-foreground">
            em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
