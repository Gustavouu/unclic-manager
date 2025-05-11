import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FilterPeriod } from '@/types/dashboard';
import { useTenant } from '@/contexts/TenantContext';

export interface DashboardStats {
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  newClients: number;
  popularServices: Array<{id: string, name: string, count: number}>;
  upcomingAppointments: any[];
  revenueData: Array<{date: string, value: number}>;
  retentionRate: number;
  newClientsCount: number;
  returningClientsCount: number;
  
  // Added properties to fix TypeScript errors
  clientsCount: number;
  todayAppointments: number;
  monthlyRevenue: number;
  monthlyServices: number;
  occupancyRate: number;
  nextAppointments: any[];
}

export const useDashboardData = (period: FilterPeriod = 'month') => {
  const [stats, setStats] = useState<DashboardStats>({
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
    
    // Initialize added properties
    clientsCount: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    monthlyServices: 0,
    occupancyRate: 0,
    nextAppointments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  // Helper for date ranges based on period
  const getDateRange = useCallback(() => {
    const today = new Date();
    const startDate = new Date();
    
    switch(period) {
      case 'today':
        // Just today
        return { start: today, end: today };
      case 'week':
        // Last 7 days
        startDate.setDate(today.getDate() - 7);
        return { start: startDate, end: today };
      case 'month':
        // Last 30 days
        startDate.setDate(today.getDate() - 30);
        return { start: startDate, end: today };
      case 'quarter':
        // Last 90 days
        startDate.setDate(today.getDate() - 90);
        return { start: startDate, end: today };
      case 'year':
        // Last 365 days
        startDate.setDate(today.getDate() - 365);
        return { start: startDate, end: today };
      default:
        // Default to month
        startDate.setDate(today.getDate() - 30);
        return { start: startDate, end: today };
    }
  }, [period]);

  // Fetch dashboard data
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
        const dateRange = getDateRange();
        
        // Format dates for database queries
        const startDateFormatted = dateRange.start.toISOString().split('T')[0];
        const endDateFormatted = dateRange.end.toISOString().split('T')[0];
        
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
        
        // Calculate revenue data by day for chart
        const revenueByDay = new Map<string, number>();
        appointmentsData?.forEach(app => {
          const day = app.data;
          revenueByDay.set(day, (revenueByDay.get(day) || 0) + (app.valor || 0));
        });
        
        const revenueData = Array.from(revenueByDay.entries()).map(([date, value]) => ({
          date,
          value
        })).sort((a, b) => a.date.localeCompare(b.date));
        
        // Process popular services
        const serviceCountMap = new Map<string, {id: string, name: string, count: number}>();
        popularServicesData?.forEach(app => {
          if (!app.id_servico || !app.servicos) return;
          
          const serviceId = app.id_servico;
          const existing = serviceCountMap.get(serviceId);
          
          if (existing) {
            existing.count += 1;
          } else {
            serviceCountMap.set(serviceId, {
              id: serviceId,
              name: app.servicos.nome || "Serviço desconhecido",
              count: 1
            });
          }
        });
        
        const popularServices = Array.from(serviceCountMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
          
        // Map upcoming appointments
        const upcomingAppointments = upcomingAppointmentsData?.map(app => {
          const clientName = app.clientes?.nome || app.clientes?.name || "Cliente não identificado";
          const serviceName = app.servicos?.nome || app.servicos?.name || "Serviço não identificado";
          const professionalName = app.funcionarios?.nome || app.funcionarios?.name || "Profissional não identificado";
          
          return {
            id: app.id,
            clientName,
            serviceName,
            professionalName,
            date: `${app.data}T${app.hora_inicio}`,
            status: app.status
          };
        }) || [];
        
        // Calculate retention metrics
        const retentionRate = completedAppointments > 0 ? 
          Math.round((completedAppointments / totalAppointments) * 100) : 0;
        
        // Simplified calculation for new vs returning clients
        const newClientsCount = newClientsData?.length || 0;
        const returningClientsCount = Math.max(
          0, 
          totalAppointments - newClientsCount
        );
        
        // Update stats state with all required fields
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
          
          // Add values for the new properties
          clientsCount: newClientsCount + returningClientsCount,
          todayAppointments: upcomingAppointments.length,
          monthlyRevenue: totalRevenue,
          monthlyServices: completedAppointments,
          occupancyRate: retentionRate, // Using retention rate as an approximation
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
  }, [businessId, period, getDateRange]);

  return { stats, loading, error };
};
