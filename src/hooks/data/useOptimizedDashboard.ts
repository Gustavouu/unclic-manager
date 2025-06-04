
import { useState, useEffect } from 'react';

interface DashboardMetrics {
  todayAppointments: number;
  upcomingAppointments: number;
  activeClients: number;
  totalClients: number;
  monthRevenue: number;
  weekAppointments: number;
  completionRate: number;
  popularServices: Array<{ name: string; count: number }>;
}

export const useOptimizedDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    todayAppointments: 0,
    upcomingAppointments: 0,
    activeClients: 0,
    totalClients: 0,
    monthRevenue: 0,
    weekAppointments: 0,
    completionRate: 0,
    popularServices: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadMetrics = async () => {
      setIsLoading(true);
      
      // Mock data for demonstration
      setTimeout(() => {
        setMetrics({
          todayAppointments: 3,
          upcomingAppointments: 7,
          activeClients: 45,
          totalClients: 120,
          monthRevenue: 8500,
          weekAppointments: 12,
          completionRate: 95,
          popularServices: [
            { name: 'Corte de Cabelo', count: 25 },
            { name: 'Barba', count: 18 },
            { name: 'Sobrancelha', count: 12 },
          ],
        });
        setIsLoading(false);
      }, 1000);
    };

    loadMetrics();
  }, []);

  return {
    metrics,
    isLoading,
  };
};
