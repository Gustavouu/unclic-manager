
import { useState, useEffect } from 'react';
import { useClients } from '@/hooks/useClients';
import { useServices } from '@/hooks/services/useServices';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface DashboardMetrics {
  totalClients: number;
  totalServices: number;
  totalAppointments: number;
  totalRevenue: number;
  newClients: number;
  completionRate: number;
  popularServices: PopularService[];
}

export interface PopularService {
  name: string;
  count: number;
}

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    totalServices: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    newClients: 0,
    completionRate: 0,
    popularServices: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { clients, isLoading: clientsLoading } = useClients();
  const { services, isLoading: servicesLoading } = useServices();
  const { businessId } = useCurrentBusiness();

  useEffect(() => {
    if (!clientsLoading && !servicesLoading && businessId) {
      calculateMetrics();
    }
  }, [clients, services, clientsLoading, servicesLoading, businessId]);

  const calculateMetrics = () => {
    setIsLoading(true);
    
    try {
      // Calculate new clients (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newClientsCount = clients.filter(client => 
        new Date(client.created_at) >= thirtyDaysAgo
      ).length;

      // Mock data for appointments and revenue (replace with real data later)
      const mockAppointments = Math.floor(Math.random() * 100) + 50;
      const mockRevenue = Math.floor(Math.random() * 10000) + 5000;
      const mockCompletionRate = Math.floor(Math.random() * 30) + 70;

      // Create popular services from available services
      const popularServices = services.slice(0, 3).map((service, index) => ({
        name: service.name,
        count: Math.floor(Math.random() * 20) + (3 - index) * 5
      }));

      setMetrics({
        totalClients: clients.length,
        totalServices: services.length,
        totalAppointments: mockAppointments,
        totalRevenue: mockRevenue,
        newClients: newClientsCount,
        completionRate: mockCompletionRate,
        popularServices,
      });

      setError('');
    } catch (err) {
      console.error('Error calculating dashboard metrics:', err);
      setError('Erro ao calcular métricas do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    if (businessId) {
      calculateMetrics();
    }
  };

  return {
    metrics,
    isLoading: isLoading || clientsLoading || servicesLoading,
    error,
    refreshData,
  };
};
