
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats, FilterPeriod } from '@/types/dashboard';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

export const useDashboardRealtime = (period: FilterPeriod = 'month') => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { businessId } = useTenant();
  
  // Function to calculate the date range based on period
  const getDateRange = () => {
    const endDate = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'today':
        startDate = new Date(endDate);
        break;
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }
    
    return { startDate, endDate };
  };
  
  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    if (!businessId) return;
    
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange();
      
      // Format dates for PostgreSQL
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // Fetch metrics from the database
      const { data, error } = await supabase.rpc(
        'obter_metricas_periodo',
        { 
          p_tenant_id: businessId,
          p_data_inicio: startDateStr, 
          p_data_fim: endDateStr 
        }
      );
      
      if (error) throw error;
      
      // Process and summarize metrics data
      const processedData = processDashboardData(data || []);
      setStats(processedData);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };
  
  // Process raw data from database into dashboard stats format
  const processDashboardData = (metricsData: any[]): DashboardStats => {
    if (!metricsData.length) {
      return getDefaultStats();
    }
    
    // Calculate totals and averages from all records
    const totalAppointments = metricsData.reduce((sum, day) => sum + day.total_agendamentos, 0);
    const totalRevenue = metricsData.reduce((sum, day) => sum + Number(day.total_vendas), 0);
    const completedAppointments = Math.round(totalAppointments * 0.85); // Estimate if not available
    const newClients = metricsData.reduce((sum, day) => sum + day.novos_clientes, 0);
    
    // Get popular services by combining all days and finding the most common
    const allServices: any[] = [];
    metricsData.forEach(day => {
      if (day.servicos_populares) {
        allServices.push(...day.servicos_populares);
      }
    });
    
    const popularServices = processPopularServices(allServices);
    const revenueData = metricsData.map(day => ({
      date: day.data_referencia,
      value: Number(day.total_vendas)
    }));
    
    // Estimate client retention stats
    const retencionRate = 70; // Default estimated value
    const returnClientsRatio = retencionRate / 100;
    const returningClientsCount = Math.round(newClients * returnClientsRatio / (1 - returnClientsRatio));
    const clientsCount = newClients + returningClientsCount;
    
    return {
      totalAppointments,
      completedAppointments,
      totalRevenue,
      newClients,
      clientsCount,
      todayAppointments: metricsData[metricsData.length - 1]?.total_agendamentos || 0,
      monthlyRevenue: totalRevenue,
      monthlyServices: totalAppointments,
      occupancyRate: 65, // Estimated, could be calculated from schedule data
      popularServices,
      upcomingAppointments: [],  // Would need to fetch separately
      nextAppointments: [],      // Would need to fetch separately
      revenueData,
      retentionRate: retencionRate,
      newClientsCount: newClients,
      returningClientsCount
    };
  };
  
  const processPopularServices = (services: any[]): Array<{id: string, name: string, count: number}> => {
    const serviceMap: Record<string, {id: string, name: string, count: number}> = {};
    
    services.forEach(service => {
      const serviceName = service.servico;
      if (!serviceName) return;
      
      if (serviceMap[serviceName]) {
        serviceMap[serviceName].count += service.total;
      } else {
        serviceMap[serviceName] = {
          id: String(Object.keys(serviceMap).length + 1),
          name: serviceName,
          count: service.total
        };
      }
    });
    
    return Object.values(serviceMap).sort((a, b) => b.count - a.count).slice(0, 5);
  };
  
  const getDefaultStats = (): DashboardStats => ({
    totalAppointments: 0,
    completedAppointments: 0,
    totalRevenue: 0,
    newClients: 0,
    clientsCount: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    monthlyServices: 0,
    occupancyRate: 0,
    popularServices: [],
    upcomingAppointments: [],
    nextAppointments: [],
    revenueData: [],
    retentionRate: 0,
    newClientsCount: 0,
    returningClientsCount: 0
  });
  
  useEffect(() => {
    fetchDashboardData();
    
    // Subscribe to realtime updates for appointments
    const appointmentsChannel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agendamentos' },
        () => {
          fetchDashboardData(); // Refresh data when appointments change
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(appointmentsChannel);
    };
  }, [businessId, period]);
  
  return {
    stats: stats || getDefaultStats(),
    loading,
    refresh: fetchDashboardData
  };
};
