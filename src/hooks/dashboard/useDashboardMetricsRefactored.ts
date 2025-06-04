
import { useState, useEffect } from 'react';
import type { DashboardMetrics, RevenueDataPoint, PopularService, UseDashboardMetricsReturn } from './types';

export const useDashboardMetricsRefactored = (): UseDashboardMetricsReturn => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAppointments: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    activeClients: 0,
    newClientsThisMonth: 0,
    servicesCompleted: 0,
    averageTicket: 0,
    growthRate: 0,
    retentionRate: 0,
  });

  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [popularServices, setPopularServices] = useState<PopularService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular carregamento de dados reais
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mock baseados na imagem do dashboard
      setMetrics({
        totalAppointments: 156,
        totalClients: 89,
        monthlyRevenue: 15750.00,
        todayAppointments: 12,
        pendingAppointments: 5,
        completedAppointments: 134,
        activeClients: 67,
        newClientsThisMonth: 15,
        servicesCompleted: 142,
        averageTicket: 85.50,
        growthRate: 12.5,
        retentionRate: 78.9,
      });

      setRevenueData([
        { date: '2024-01', value: 12500 },
        { date: '2024-02', value: 13200 },
        { date: '2024-03', value: 14100 },
        { date: '2024-04', value: 13800 },
        { date: '2024-05', value: 15200 },
        { date: '2024-06', value: 15750 },
      ]);

      setPopularServices([
        { id: '1', name: 'Corte de Cabelo', count: 45, percentage: 31.7 },
        { id: '2', name: 'Barba', count: 32, percentage: 22.5 },
        { id: '3', name: 'Sobrancelha', count: 28, percentage: 19.7 },
        { id: '4', name: 'Coloração', count: 25, percentage: 17.6 },
        { id: '5', name: 'Tratamento', count: 12, percentage: 8.5 },
      ]);

      setLastUpdate(new Date());
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Dashboard data loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    metrics,
    revenueData,
    popularServices,
    isLoading,
    error,
    formatCurrency,
    lastUpdate,
    refreshData,
  };
};
