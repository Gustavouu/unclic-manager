
import { useState, useEffect } from 'react';

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

export interface DashboardStats {
  totalClients: number;
  monthlyRevenue: number;
  totalAppointments: number;
  averageRating: number;
}

export const useDashboardData = () => {
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
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshData = () => {
    setIsLoading(true);
    setLoading(true);
    
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

      setStats({
        totalClients: 150,
        monthlyRevenue: 8500,
        totalAppointments: 85,
        averageRating: 4.8,
      });

      setIsLoading(false);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    metrics,
    stats,
    isLoading,
    loading,
    error,
    refreshData,
  };
};
