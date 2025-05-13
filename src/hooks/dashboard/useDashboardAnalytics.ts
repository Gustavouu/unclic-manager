
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FilterPeriod } from '@/types/dashboard';

export interface DashboardMetrics {
  clientsCount: number;
  todayAppointments: number;
  upcomingAppointments: any[];
  monthlyRevenue: number;
  monthlyServices: number;
  appointmentsByStatus: {
    scheduled: number;
    completed: number;
    canceled: number;
    noShow: number;
  };
  revenueData: {
    date: string;
    value: number;
  }[];
  popularServices: {
    id: string;
    name: string;
    count: number;
    percentage: number;
  }[];
}

const initialMetrics: DashboardMetrics = {
  clientsCount: 0,
  todayAppointments: 0,
  upcomingAppointments: [],
  monthlyRevenue: 0,
  monthlyServices: 0,
  appointmentsByStatus: {
    scheduled: 0,
    completed: 0,
    canceled: 0,
    noShow: 0
  },
  revenueData: [],
  popularServices: []
};

export function useDashboardAnalytics(period: FilterPeriod = 'month') {
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get date ranges based on the selected period
        const today = new Date();
        const startDate = new Date();
        
        switch (period) {
          case 'today':
            // Start and end are the same day
            break;
          case 'week':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case 'quarter':
            startDate.setMonth(startDate.getMonth() - 3);
            break;
          case 'year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        }
        
        // Format dates for Supabase queries
        const startDateStr = startDate.toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];
        
        // Fetch clients count
        const { count: clientsCount, error: clientsError } = await supabase
          .from('clientes')
          .select('*', { count: 'exact', head: true });
        
        if (clientsError) throw new Error(`Error fetching clients: ${clientsError.message}`);
        
        // Fetch today's appointments
        const { data: todayAppointments, error: todayApptError } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('data', todayStr);
        
        if (todayApptError) throw new Error(`Error fetching today's appointments: ${todayApptError.message}`);
        
        // Fetch upcoming appointments
        const { data: upcomingAppts, error: upcomingError } = await supabase
          .from('agendamentos')
          .select(`
            *,
            clientes:id_cliente (nome),
            servicos:id_servico (nome),
            funcionarios:id_funcionario (nome)
          `)
          .gte('data', todayStr)
          .order('data', { ascending: true })
          .order('hora_inicio', { ascending: true })
          .limit(5);
        
        if (upcomingError) throw new Error(`Error fetching upcoming appointments: ${upcomingError.message}`);
        
        // Fetch appointments by period
        const { data: periodAppointments, error: periodError } = await supabase
          .from('agendamentos')
          .select('*')
          .gte('data', startDateStr)
          .lte('data', todayStr);
        
        if (periodError) throw new Error(`Error fetching period appointments: ${periodError.message}`);
        
        // Fetch payments data for revenue calculation
        const { data: payments, error: paymentsError } = await supabase
          .from('pagamentos')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', today.toISOString());
        
        if (paymentsError) throw new Error(`Error fetching payments: ${paymentsError.message}`);
        
        // Calculate metrics
        const totalRevenue = payments?.reduce((sum, payment) => sum + (payment.valor || 0), 0) || 0;
        
        // Calculate appointments by status
        const appointmentsByStatus = {
          scheduled: periodAppointments?.filter(a => a.status === 'agendado').length || 0,
          completed: periodAppointments?.filter(a => a.status === 'concluido').length || 0,
          canceled: periodAppointments?.filter(a => a.status === 'cancelado').length || 0,
          noShow: periodAppointments?.filter(a => a.status === 'nao_compareceu').length || 0
        };
        
        // Calculate revenue data for charts
        const revenueByDay = new Map<string, number>();
        
        payments?.forEach(payment => {
          const day = new Date(payment.created_at).toISOString().split('T')[0];
          revenueByDay.set(day, (revenueByDay.get(day) || 0) + (payment.valor || 0));
        });
        
        const revenueData = Array.from(revenueByDay.entries())
          .map(([date, value]) => ({ date, value }))
          .sort((a, b) => a.date.localeCompare(b.date));
        
        // Calculate popular services
        const serviceCountMap = new Map<string, { id: string, name: string, count: number }>();
        
        periodAppointments?.forEach(async (appointment) => {
          if (!appointment.id_servico) return;
          
          // Get service name if not already in the map
          if (!serviceCountMap.has(appointment.id_servico)) {
            const { data: service } = await supabase
              .from('servicos')
              .select('nome')
              .eq('id', appointment.id_servico)
              .single();
              
            if (service) {
              serviceCountMap.set(appointment.id_servico, {
                id: appointment.id_servico,
                name: service.nome,
                count: 1
              });
            }
          } else {
            const existing = serviceCountMap.get(appointment.id_servico);
            if (existing) {
              existing.count += 1;
              serviceCountMap.set(appointment.id_servico, existing);
            }
          }
        });
        
        // Calculate percentages for popular services
        const totalServices = Array.from(serviceCountMap.values()).reduce((sum, service) => sum + service.count, 0);
        
        const popularServices = Array.from(serviceCountMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map(service => ({
            ...service,
            percentage: totalServices > 0 ? (service.count / totalServices) * 100 : 0
          }));
        
        // Update metrics
        setMetrics({
          clientsCount: clientsCount || 0,
          todayAppointments: todayAppointments?.length || 0,
          upcomingAppointments: upcomingAppts || [],
          monthlyRevenue: totalRevenue,
          monthlyServices: periodAppointments?.length || 0,
          appointmentsByStatus,
          revenueData,
          popularServices
        });
        
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
        toast.error("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [period]);
  
  return { metrics, loading, error };
}
