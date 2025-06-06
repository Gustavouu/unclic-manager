
import { useState, useEffect, useCallback } from 'react';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, subMonths, eachDayOfInterval } from 'date-fns';

export interface DashboardMetricsReal {
  totalAppointments: number;
  totalClients: number;
  monthlyRevenue: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  activeClients: number;
  newClientsThisMonth: number;
  averageTicket: number;
  growthRate: number;
  retentionRate: number;
  cancellationRate: number;
}

export interface RevenueChartData {
  date: string;
  value: number;
  appointments: number;
  target?: number;
}

export interface PopularServiceReal {
  id: string;
  name: string;
  count: number;
  percentage: number;
  revenue: number;
}

interface UseDashboardMetricsRealReturn {
  metrics: DashboardMetricsReal;
  revenueData: RevenueChartData[];
  popularServices: PopularServiceReal[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => void;
  formatCurrency: (value: number) => string;
}

export const useDashboardMetricsReal = (): UseDashboardMetricsRealReturn => {
  const [metrics, setMetrics] = useState<DashboardMetricsReal>({
    totalAppointments: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    activeClients: 0,
    newClientsThisMonth: 0,
    averageTicket: 0,
    growthRate: 0,
    retentionRate: 0,
    cancellationRate: 0,
  });

  const [revenueData, setRevenueData] = useState<RevenueChartData[]>([]);
  const [popularServices, setPopularServices] = useState<PopularServiceReal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { businessId } = useCurrentBusiness();

  const fetchDashboardData = useCallback(async () => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching real dashboard data for business:', businessId);

      const now = new Date();
      const startThisMonth = startOfMonth(now);
      const endThisMonth = endOfMonth(now);
      const startLastMonth = startOfMonth(subMonths(now, 1));
      const endLastMonth = endOfMonth(subMonths(now, 1));
      const today = format(now, 'yyyy-MM-dd');

      // Fetch all data in parallel
      const [
        appointmentsResponse,
        clientsResponse,
        servicesResponse,
        lastMonthAppointmentsResponse
      ] = await Promise.all([
        // Current month appointments with services
        supabase
          .from('bookings')
          .select(`
            *,
            services!inner(name, price)
          `)
          .eq('business_id', businessId)
          .gte('booking_date', format(startThisMonth, 'yyyy-MM-dd'))
          .lte('booking_date', format(endThisMonth, 'yyyy-MM-dd')),

        // All clients
        supabase
          .from('clients')
          .select('*')
          .eq('business_id', businessId),

        // All services
        supabase
          .from('services')
          .select('*')
          .eq('business_id', businessId)
          .eq('is_active', true),

        // Last month appointments for growth calculation
        supabase
          .from('bookings')
          .select('*')
          .eq('business_id', businessId)
          .gte('booking_date', format(startLastMonth, 'yyyy-MM-dd'))
          .lte('booking_date', format(endLastMonth, 'yyyy-MM-dd'))
      ]);

      if (appointmentsResponse.error) throw appointmentsResponse.error;
      if (clientsResponse.error) throw clientsResponse.error;
      if (servicesResponse.error) throw servicesResponse.error;
      if (lastMonthAppointmentsResponse.error) throw lastMonthAppointmentsResponse.error;

      const appointments = appointmentsResponse.data || [];
      const clients = clientsResponse.data || [];
      const services = servicesResponse.data || [];
      const lastMonthAppointments = lastMonthAppointmentsResponse.data || [];

      // Calculate metrics
      const totalAppointments = appointments.length;
      const totalClients = clients.length;
      const todayAppointments = appointments.filter(apt => apt.booking_date === today).length;
      
      const pendingAppointments = appointments.filter(apt => 
        apt.status === 'scheduled' || apt.status === 'confirmed'
      ).length;
      
      const completedAppointments = appointments.filter(apt => 
        apt.status === 'completed'
      ).length;

      const canceledAppointments = appointments.filter(apt => 
        apt.status === 'canceled'
      ).length;

      // Calculate revenue from completed appointments
      const monthlyRevenue = appointments
        .filter(apt => apt.status === 'completed')
        .reduce((sum, apt) => sum + (apt.price || 0), 0);

      // Active clients (those with appointments in last 30 days)
      const thirtyDaysAgo = subMonths(now, 1);
      const activeClients = clients.filter(client => {
        if (!client.last_visit) return false;
        return new Date(client.last_visit) >= thirtyDaysAgo;
      }).length;

      // New clients this month
      const newClientsThisMonth = clients.filter(client => {
        if (!client.created_at) return false;
        const createdDate = new Date(client.created_at);
        return createdDate >= startThisMonth && createdDate <= endThisMonth;
      }).length;

      // Average ticket
      const averageTicket = completedAppointments > 0 ? monthlyRevenue / completedAppointments : 0;

      // Growth rate (compared to last month)
      const lastMonthTotal = lastMonthAppointments.length;
      const growthRate = lastMonthTotal > 0 ? 
        ((totalAppointments - lastMonthTotal) / lastMonthTotal) * 100 : 0;

      // Cancellation rate
      const cancellationRate = totalAppointments > 0 ? 
        (canceledAppointments / totalAppointments) * 100 : 0;

      // Retention rate (simplified calculation)
      const retentionRate = totalClients > 0 ? (activeClients / totalClients) * 100 : 0;

      // Generate revenue data for last 6 months
      const revenueChartData: RevenueChartData[] = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(now, i);
        const monthStart = format(startOfMonth(monthDate), 'yyyy-MM-dd');
        const monthEnd = format(endOfMonth(monthDate), 'yyyy-MM-dd');

        // Get appointments for this month
        const { data: monthAppointments } = await supabase
          .from('bookings')
          .select('price, status')
          .eq('business_id', businessId)
          .gte('booking_date', monthStart)
          .lte('booking_date', monthEnd);

        const monthRevenue = (monthAppointments || [])
          .filter(apt => apt.status === 'completed')
          .reduce((sum, apt) => sum + (apt.price || 0), 0);

        const monthAppointmentCount = (monthAppointments || []).length;

        revenueChartData.push({
          date: format(monthDate, 'MMM'),
          value: monthRevenue,
          appointments: monthAppointmentCount,
          target: monthRevenue * 1.1 // 10% growth target
        });
      }

      // Calculate popular services
      const serviceCount: Record<string, { count: number; revenue: number; name: string }> = {};
      
      appointments.forEach(appointment => {
        if (appointment.services?.name) {
          const serviceId = appointment.service_id;
          if (!serviceCount[serviceId]) {
            serviceCount[serviceId] = {
              count: 0,
              revenue: 0,
              name: appointment.services.name
            };
          }
          serviceCount[serviceId].count++;
          if (appointment.status === 'completed') {
            serviceCount[serviceId].revenue += appointment.price || 0;
          }
        }
      });

      const popularServicesData: PopularServiceReal[] = Object.entries(serviceCount)
        .map(([id, data]) => ({
          id,
          name: data.name,
          count: data.count,
          percentage: totalAppointments > 0 ? (data.count / totalAppointments) * 100 : 0,
          revenue: data.revenue
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Update state
      setMetrics({
        totalAppointments,
        totalClients,
        monthlyRevenue,
        todayAppointments,
        pendingAppointments,
        completedAppointments,
        activeClients,
        newClientsThisMonth,
        averageTicket,
        growthRate,
        retentionRate,
        cancellationRate,
      });

      setRevenueData(revenueChartData);
      setPopularServices(popularServicesData);

      console.log('Dashboard metrics loaded successfully:', {
        totalAppointments,
        totalClients,
        monthlyRevenue,
        popularServicesCount: popularServicesData.length
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  return {
    metrics,
    revenueData,
    popularServices,
    isLoading,
    error,
    refreshData: fetchDashboardData,
    formatCurrency,
  };
};
