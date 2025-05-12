
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FilterPeriod } from '@/types/dashboard';
import { useTenant } from '@/contexts/TenantContext';
import { getDateRange, formatDateForQuery } from './utils/dateRangeUtils';
import { processPopularServices } from './utils/serviceUtils';
import { formatUpcomingAppointments, calculateRevenueByDay } from './utils/appointmentUtils';

export type { DashboardStats } from './models/dashboardTypes';
import { 
  DashboardStats, 
  AppointmentData, 
  ServiceData, 
  UpcomingAppointmentData 
} from './models/dashboardTypes';

const initialStats: DashboardStats = {
  totalAppointments: 0,
  completedAppointments: 0,
  totalRevenue: 0,
  newClients: 0,
  popularServices: [],
  upcomingAppointments: [],
  revenueData: [],
  retentionRate: 0,
  newClientsCount: 0,
  returningClientsCount: 0,
  
  // Added properties with default values
  clientsCount: 0,
  todayAppointments: 0,
  monthlyRevenue: 0,
  monthlyServices: 0,
  occupancyRate: 0,
  nextAppointments: []
};

export const useDashboardData = (period: FilterPeriod = 'month') => {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchStats = async () => {
      if (!businessId) {
        console.log('No business ID available, skipping dashboard data fetch');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching dashboard data for business ID:', businessId, 'period:', period);
        const dateRange = getDateRange(period);
        
        // Format dates for database queries
        const startDateFormatted = formatDateForQuery(dateRange.start);
        const endDateFormatted = formatDateForQuery(dateRange.end);
        
        // 1. Get appointment statistics
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('agendamentos')
          .select('id, data, valor, status')
          .eq('id_negocio', businessId)
          .gte('data', startDateFormatted)
          .lte('data', endDateFormatted);
          
        if (appointmentsError) throw appointmentsError;
        
        // 2. Get new clients in period
        const { data: newClientsData, error: newClientsError } = await supabase
          .from('clientes')
          .select('id')
          .eq('id_negocio', businessId)
          .gte('criado_em', startDateFormatted)
          .lte('criado_em', endDateFormatted);
          
        if (newClientsError) throw newClientsError;
        
        // 3. Get popular services
        const { data: popularServicesData, error: popularServicesError } = await supabase
          .from('agendamentos')
          .select(`
            id_servico,
            servicos:id_servico (id, nome)
          `)
          .eq('id_negocio', businessId)
          .gte('data', startDateFormatted)
          .lte('data', endDateFormatted);
          
        if (popularServicesError) throw popularServicesError;
        
        // 4. Get upcoming appointments
        const { data: upcomingAppointmentsData, error: upcomingAppointmentsError } = await supabase
          .from('agendamentos')
          .select(`
            *,
            clientes:id_cliente (nome),
            servicos:id_servico (nome),
            funcionarios:id_funcionario (nome)
          `)
          .eq('id_negocio', businessId)
          .gte('data', new Date().toISOString().split('T')[0])
          .in('status', ['agendado', 'confirmado'])
          .order('data', { ascending: true })
          .order('hora_inicio', { ascending: true })
          .limit(5);
          
        if (upcomingAppointmentsError) throw upcomingAppointmentsError;
        
        // Calculate stats from fetched data
        const totalAppointments = appointmentsData?.length || 0;
        const completedAppointments = appointmentsData?.filter(a => a.status === 'concluido').length || 0;
        const totalRevenue = appointmentsData?.reduce((sum, app) => sum + (app.valor || 0), 0) || 0;
        
        // Process revenue data for chart
        const revenueData = calculateRevenueByDay(appointmentsData);
        
        // Process popular services
        const popularServices = processPopularServices(popularServicesData as ServiceData[]);
        
        // Format upcoming appointments
        const upcomingAppointments = formatUpcomingAppointments(upcomingAppointmentsData as UpcomingAppointmentData[]);
        
        // Calculate retention metrics
        const retentionRate = completedAppointments > 0 ? 
          Math.round((completedAppointments / totalAppointments) * 100) : 0;
        
        // Get total clients count
        const { count: clientsCount, error: clientsCountError } = await supabase
          .from('clientes')
          .select('*', { count: 'exact', head: true })
          .eq('id_negocio', businessId);
        
        if (clientsCountError) throw clientsCountError;
        
        // Get today's appointments
        const { data: todayAppointmentsData, error: todayAppointmentsError } = await supabase
          .from('agendamentos')
          .select('id')
          .eq('id_negocio', businessId)
          .eq('data', new Date().toISOString().split('T')[0]);
          
        if (todayAppointmentsError) throw todayAppointmentsError;
        
        const todayAppointments = todayAppointmentsData?.length || 0;
        
        // Calculate new vs returning clients
        const newClientsCount = newClientsData?.length || 0;
        const returningClientsCount = Math.max(0, totalAppointments - newClientsCount);
        
        // Update stats state
        setStats({
          totalAppointments,
          completedAppointments,
          totalRevenue,
          newClients: newClientsCount,
          popularServices,
          upcomingAppointments,
          revenueData,
          retentionRate,
          newClientsCount,
          returningClientsCount,
          
          // Add values for the additional properties
          clientsCount: clientsCount || 0,
          todayAppointments,
          monthlyRevenue: totalRevenue,
          monthlyServices: totalAppointments,
          occupancyRate: retentionRate, // Using retention rate as placeholder for occupancy rate
          nextAppointments: upcomingAppointments
        });
        
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
        toast.error("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [businessId, period]);

  return { stats, loading, error };
};
