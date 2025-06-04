
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

      // Fetch all data in parallel
      const [
        clientsResponse,
        servicesResponse,
        professionalsResponse,
        appointmentsResponse
      ] = await Promise.all([
        // Total clients
        supabase
          .from('clients')
          .select('id, criado_em')
          .eq('id_negocio', businessId),
        
        // Total services
        supabase
          .from('servicos')
          .select('id, nome')
          .eq('id_negocio', businessId)
          .eq('ativo', true),
        
        // Total professionals
        supabase
          .from('funcionarios')
          .select('id')
          .eq('id_negocio', businessId)
          .eq('status', 'ativo'),
        
        // Appointments (try Appointments table first, then bookings)
        supabase
          .from('Appointments')
          .select('id, valor, status, criado_em, id_servico')
          .eq('id_negocio', businessId)
          .gte('criado_em', startDate.toISOString())
      ]);

      // Handle clients
      const totalClients = clientsResponse.data?.length || 0;
      const newClients = clientsResponse.data?.filter(client => 
        new Date(client.criado_em) >= startDate
      ).length || 0;

      // Handle services
      const totalServices = servicesResponse.data?.length || 0;

      // Handle professionals
      const totalProfessionals = professionalsResponse.data?.length || 0;

      // Handle appointments
      let totalAppointments = 0;
      let totalRevenue = 0;
      let completedAppointments = 0;
      let popularServicesMap: Record<string, number> = {};

      if (appointmentsResponse.data) {
        totalAppointments = appointmentsResponse.data.length;
        completedAppointments = appointmentsResponse.data.filter(apt => 
          apt.status === 'concluido' || apt.status === 'completed'
        ).length;
        
        totalRevenue = appointmentsResponse.data.reduce((sum, apt) => {
          if (apt.status === 'concluido' || apt.status === 'completed') {
            return sum + (apt.valor || 0);
          }
          return sum;
        }, 0);

        // Count popular services
        appointmentsResponse.data.forEach(apt => {
          if (apt.id_servico) {
            popularServicesMap[apt.id_servico] = (popularServicesMap[apt.id_servico] || 0) + 1;
          }
        });
      } else {
        // Try bookings table as fallback
        const bookingsResponse = await supabase
          .from('bookings')
          .select('id, price, status, created_at, service_id')
          .eq('business_id', businessId)
          .gte('created_at', startDate.toISOString());

        if (bookingsResponse.data) {
          totalAppointments = bookingsResponse.data.length;
          completedAppointments = bookingsResponse.data.filter(apt => 
            apt.status === 'completed'
          ).length;
          
          totalRevenue = bookingsResponse.data.reduce((sum, apt) => {
            if (apt.status === 'completed') {
              return sum + (apt.price || 0);
            }
            return sum;
          }, 0);

          // Count popular services
          bookingsResponse.data.forEach(apt => {
            if (apt.service_id) {
              popularServicesMap[apt.service_id] = (popularServicesMap[apt.service_id] || 0) + 1;
            }
          });
        }
      }

      // Get service names for popular services
      const popularServices: Array<{id: string, name: string, count: number}> = [];
      
      if (Object.keys(popularServicesMap).length > 0 && servicesResponse.data) {
        const sortedServices = Object.entries(popularServicesMap)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5);

        for (const [serviceId, count] of sortedServices) {
          const service = servicesResponse.data.find(s => s.id === serviceId);
          if (service) {
            popularServices.push({
              id: serviceId,
              name: service.nome,
              count
            });
          }
        }
      }

      const completionRate = totalAppointments > 0 
        ? (completedAppointments / totalAppointments) * 100 
        : 0;

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
