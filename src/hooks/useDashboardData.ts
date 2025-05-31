
import { useState, useEffect } from 'react';

export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface DashboardMetrics {
  totalClients: number;
  activeClients: number;
  totalAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
  averageTicket: number;
  retentionRate: number;
  growthRate: number;
}

export interface RevenueDataPoint {
  date: string;
  value: number;
}

export interface PopularService {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export interface DashboardStats {
  totalClients: number;
  monthlyRevenue: number;
  totalAppointments: number;
  averageRating: number;
  revenueData: RevenueDataPoint[];
  popularServices: PopularService[];
  nextAppointments: any[];
  retentionRate: number;
}

export const useDashboardData = (period: FilterPeriod = 'month') => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    activeClients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    canceledAppointments: 0,
    averageTicket: 0,
    retentionRate: 0,
    growthRate: 0,
  });
  
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    monthlyRevenue: 0,
    totalAppointments: 0,
    averageRating: 0,
    revenueData: [],
    popularServices: [],
    nextAppointments: [],
    retentionRate: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshData = () => {
    setIsLoading(true);
    
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setMetrics({
        totalClients: 150,
        activeClients: 120,
        totalAppointments: 85,
        totalRevenue: 25000,
        monthlyRevenue: 8500,
        weeklyRevenue: 2100,
        todayAppointments: 12,
        pendingAppointments: 8,
        completedAppointments: 65,
        canceledAppointments: 5,
        averageTicket: 125,
        retentionRate: 85,
        growthRate: 12,
      });

      // Generate mock revenue data
      const revenueData = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i);
        revenueData.push({
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          value: Math.floor(Math.random() * 10000) + 5000
        });
      }

      // Generate mock popular services
      const services = [
        { id: '1', name: 'Corte de Cabelo', count: 35 },
        { id: '2', name: 'Coloração', count: 22 },
        { id: '3', name: 'Manicure', count: 18 },
        { id: '4', name: 'Tratamento Facial', count: 15 },
      ];
      
      const totalServices = services.reduce((sum, service) => sum + service.count, 0);

      setStats({
        totalClients: 150,
        monthlyRevenue: 8500,
        totalAppointments: 85,
        averageRating: 4.8,
        revenueData,
        popularServices: services.map(service => ({
          ...service,
          percentage: (service.count / totalServices) * 100
        })),
        nextAppointments: [],
        retentionRate: 85
      });

      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refreshData();
  }, [period]);

  return {
    metrics,
    stats,
    isLoading,
    error,
    refreshData,
  };
};
