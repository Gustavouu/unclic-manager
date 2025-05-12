
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface PopularService {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export interface AppointmentData {
  id: string;
  date: string;
  clientName: string;
  serviceName: string;
  price: number;
  status: string;
}

export interface RevenueData {
  date: string;
  value: number;
}

export interface DashboardStats {
  clientsCount: number;
  newClientsCount: number;
  returningClientsCount: number;
  retentionRate: number;
  todayAppointments: number;
  monthlyRevenue: number;
  monthlyServices: number;
  popularServices: PopularService[];
  revenueData: RevenueData[];
  upcomingAppointments: AppointmentData[];
}

const getDefaultStats = (): DashboardStats => ({
  clientsCount: 0,
  newClientsCount: 0,
  returningClientsCount: 0,
  retentionRate: 0,
  todayAppointments: 0,
  monthlyRevenue: 0,
  monthlyServices: 0,
  popularServices: [],
  revenueData: [],
  upcomingAppointments: []
});

// Mock data for development purposes
const getMockData = (period: FilterPeriod): DashboardStats => {
  // Generate some mock data based on the period
  const mockRevenueData = [
    { date: '2025-01', value: 4500 },
    { date: '2025-02', value: 5200 },
    { date: '2025-03', value: 4800 },
    { date: '2025-04', value: 6000 },
    { date: '2025-05', value: 7200 },
  ];

  const mockPopularServices = [
    { id: '1', name: 'Haircut', count: 42, percentage: 35 },
    { id: '2', name: 'Hair Color', count: 28, percentage: 23 },
    { id: '3', name: 'Styling', count: 22, percentage: 18 },
    { id: '4', name: 'Manicure', count: 16, percentage: 13 },
    { id: '5', name: 'Facial', count: 12, percentage: 10 }
  ];

  const mockAppointments = [
    { id: '1', date: '2025-05-12T10:00:00', clientName: 'John Doe', serviceName: 'Haircut', price: 35, status: 'scheduled' },
    { id: '2', date: '2025-05-12T11:30:00', clientName: 'Jane Smith', serviceName: 'Hair Color', price: 75, status: 'scheduled' },
    { id: '3', date: '2025-05-12T14:00:00', clientName: 'Michael Brown', serviceName: 'Styling', price: 45, status: 'scheduled' }
  ];

  // Adjust values based on period
  const multiplier = period === 'today' ? 0.2 : 
                    period === 'week' ? 0.5 : 
                    period === 'month' ? 1 : 
                    period === 'quarter' ? 3 : 5;

  return {
    clientsCount: Math.round(120 * multiplier),
    newClientsCount: Math.round(30 * multiplier),
    returningClientsCount: Math.round(90 * multiplier),
    retentionRate: 75,
    todayAppointments: mockAppointments.length,
    monthlyRevenue: 5900 * multiplier,
    monthlyServices: Math.round(78 * multiplier),
    popularServices: mockPopularServices,
    revenueData: mockRevenueData,
    upcomingAppointments: mockAppointments
  };
};

export function useDashboardData(period: FilterPeriod = 'month') {
  const [stats, setStats] = useState<DashboardStats>(getDefaultStats());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a production environment, uncomment this code to fetch real data
        // const { data, error } = await supabase
        //   .rpc('get_dashboard_stats', { p_period: period })
        
        // if (error) throw error;
        
        // For development, using mock data
        const mockData = getMockData(period);
        
        // Short delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStats(mockData);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return { stats, loading, error };
}
