
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface DashboardMetrics {
  totalClients: number;
  totalServices: number;
  totalProfessionals: number;
  totalAppointments: number;
  totalRevenue: number;
  newClients: number;
  completionRate: number;
  popularServices: Array<{
    id: string;
    name: string;
    count: number;
  }>;
}

export const useDashboardData = (period: FilterPeriod = 'month') => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    totalServices: 0,
    totalProfessionals: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    newClients: 0,
    completionRate: 0,
    popularServices: [],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { businessId } = useCurrentBusiness();

  const refreshData = async () => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Calculate date range based on period
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      console.log(`Loading dashboard data for business ${businessId}, period: ${period}`);

      // Fetch total clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, criado_em, created_at')
        .eq('id_negocio', businessId);

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
      }

      const totalClients = clientsData?.length || 0;
      const newClients = clientsData?.filter(client => {
        const createdDate = new Date(client.criado_em || client.created_at);
        return createdDate >= startDate;
      }).length || 0;

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('servicos')
        .select('id, nome')
        .eq('id_negocio', businessId)
        .eq('ativo', true);

      if (servicesError) {
        console.error('Error fetching services:', servicesError);
      }

      const totalServices = servicesData?.length || 0;

      // Fetch professionals/funcionarios
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('funcionarios')
        .select('id')
        .eq('id_negocio', businessId)
        .eq('status', 'ativo');

      if (professionalsError) {
        console.error('Error fetching professionals:', professionalsError);
      }

      const totalProfessionals = professionalsData?.length || 0;

      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('Appointments')
        .select('id, valor, status, criado_em, created_at, id_servico')
        .eq('id_negocio', businessId)
        .gte('criado_em', startDate.toISOString());

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
      }

      const totalAppointments = appointmentsData?.length || 0;
      const completedAppointments = appointmentsData?.filter(apt => 
        apt.status === 'concluido' || apt.status === 'completed'
      ).length || 0;
      
      const totalRevenue = appointmentsData?.reduce((sum, apt) => {
        if (apt.status === 'concluido' || apt.status === 'completed') {
          return sum + (apt.valor || 0);
        }
        return sum;
      }, 0) || 0;

      const completionRate = totalAppointments > 0 
        ? (completedAppointments / totalAppointments) * 100 
        : 0;

      // Calculate popular services
      const serviceCount: Record<string, number> = {};
      appointmentsData?.forEach(apt => {
        if (apt.id_servico) {
          serviceCount[apt.id_servico] = (serviceCount[apt.id_servico] || 0) + 1;
        }
      });

      const popularServices = Object.entries(serviceCount)
        .map(([serviceId, count]) => {
          const service = servicesData?.find(s => s.id === serviceId);
          return {
            id: serviceId,
            name: service?.nome || 'Serviço',
            count
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setMetrics({
        totalClients,
        totalServices,
        totalProfessionals,
        totalAppointments,
        totalRevenue,
        newClients,
        completionRate,
        popularServices,
      });

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [period, businessId]);

  return {
    metrics,
    isLoading,
    error,
    refreshData,
  };
};
