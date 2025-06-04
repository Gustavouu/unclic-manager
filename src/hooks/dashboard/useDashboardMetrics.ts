
import { useState, useEffect, useCallback } from 'react';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { AppointmentService } from '@/services/appointments/appointmentService';
import { fetchClients } from '@/services/clientService';
import { supabase } from '@/integrations/supabase/client';

export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

interface DashboardMetrics {
  totalAppointments: number;
  totalClients: number;
  monthlyRevenue: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  activeClients: number;
  newClientsThisMonth: number;
  servicesCompleted: number;
  averageTicket: number;
  growthRate: number;
  retentionRate: number;
}

interface RevenueDataPoint {
  date: string;
  value: number;
}

interface PopularService {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAppointments: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    activeClients: 0,
    newClientsThisMonth: 0,
    servicesCompleted: 0,
    averageTicket: 0,
    growthRate: 0,
    retentionRate: 0,
  });

  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [popularServices, setPopularServices] = useState<PopularService[]>([]);
  const [nextAppointments, setNextAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { businessId } = useCurrentBusiness();

  const loadDashboardData = useCallback(async () => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get current month dates
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      const today = now.toISOString().split('T')[0];

      // Fetch clients
      const clients = await fetchClients(businessId);
      const activeClients = clients.filter(client => client.status === 'active');
      
      // Calculate new clients this month
      const newClientsThisMonth = clients.filter(client => {
        if (!client.created_at) return false;
        const createdDate = new Date(client.created_at);
        return createdDate >= new Date(startOfMonth) && createdDate <= new Date(endOfMonth);
      }).length;

      // Initialize appointment stats with default values
      let appointmentStats = {
        total: 0,
        total_revenue: 0,
        today_count: 0,
        pending_count: 0,
        completed_count: 0
      };

      try {
        const appointmentService = AppointmentService.getInstance();
        const stats = await appointmentService.getStats(businessId, startOfMonth, endOfMonth);
        
        // Map the actual AppointmentStats properties to our expected format
        appointmentStats = {
          total: stats.total || 0,
          total_revenue: stats.total_revenue || 0,
          today_count: 0, // This needs to be calculated separately as it's not in AppointmentStats
          pending_count: stats.scheduled || 0, // Use 'scheduled' as pending
          completed_count: stats.completed || 0
        };
      } catch (appointmentError) {
        console.warn('Could not fetch appointment stats, using defaults:', appointmentError);
      }

      // Try to get metrics from database function
      let dbMetrics = null;
      try {
        const { data } = await supabase.rpc('obter_metricas_periodo', {
          p_tenant_id: businessId.toString(),
          p_data_inicio: startOfMonth,
          p_data_fim: endOfMonth
        });
        dbMetrics = data;
      } catch (dbError) {
        console.warn('Could not fetch DB metrics, using calculated values:', dbError);
      }

      // Calculate metrics
      const totalRevenue = appointmentStats.total_revenue || 0;
      const totalAppointments = appointmentStats.total || 0;
      const averageTicket = totalAppointments > 0 ? totalRevenue / totalAppointments : 0;
      const growthRate = totalAppointments > 0 ? 12.5 : 0; // Placeholder calculation
      const retentionRate = activeClients.length > 0 ? 85 : 0; // Placeholder calculation

      // Generate mock revenue data for chart
      const revenueData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i);
        revenueData.push({
          date: date.toLocaleDateString('pt-BR', { month: 'short' }),
          value: Math.floor(Math.random() * 5000) + 2000
        });
      }

      // Generate mock popular services
      const services = [
        { id: '1', name: 'Corte de Cabelo', count: Math.floor(totalAppointments * 0.4) },
        { id: '2', name: 'Barba', count: Math.floor(totalAppointments * 0.25) },
        { id: '3', name: 'Sobrancelha', count: Math.floor(totalAppointments * 0.2) },
        { id: '4', name: 'Tratamento', count: Math.floor(totalAppointments * 0.15) },
      ];
      
      const totalServices = services.reduce((sum, service) => sum + service.count, 0);
      const popularServicesWithPercentage = services.map(service => ({
        ...service,
        percentage: totalServices > 0 ? (service.count / totalServices) * 100 : 0
      }));

      setMetrics({
        totalAppointments,
        totalClients: clients.length,
        monthlyRevenue: totalRevenue,
        todayAppointments: appointmentStats.today_count || 0,
        pendingAppointments: appointmentStats.pending_count || 0,
        completedAppointments: appointmentStats.completed_count || 0,
        activeClients: activeClients.length,
        newClientsThisMonth,
        servicesCompleted: Math.floor(totalAppointments * 0.8), // Assuming 80% completion rate
        averageTicket,
        growthRate,
        retentionRate,
      });

      setRevenueData(revenueData);
      setPopularServices(popularServicesWithPercentage);
      setNextAppointments([]); // Placeholder for upcoming appointments

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const refreshData = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  return {
    metrics,
    revenueData,
    popularServices,
    nextAppointments,
    isLoading,
    error,
    refreshData,
    formatCurrency,
  };
};
