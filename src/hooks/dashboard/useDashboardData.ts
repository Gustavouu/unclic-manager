
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

      // Fetch total clients with proper error handling
      let totalClients = 0;
      let newClients = 0;
      
      try {
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, criado_em, created_at')
          .eq('id_negocio', businessId);

        if (clientsError) {
          console.error('Error fetching clients:', clientsError);
        } else {
          totalClients = clientsData?.length || 0;
          newClients = clientsData?.filter(client => {
            const createdDate = new Date(client.criado_em || client.created_at);
            return createdDate >= startDate;
          }).length || 0;
        }
      } catch (err) {
        console.log('Clients query failed, using defaults');
      }

      // Set metrics with defaults
      setMetrics({
        totalClients,
        totalServices: 0,
        totalProfessionals: 0,
        totalAppointments: 0,
        totalRevenue: 0,
        newClients,
        completionRate: 0,
        popularServices: [],
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
