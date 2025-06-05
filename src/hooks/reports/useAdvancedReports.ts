
import { useState, useEffect } from 'react';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

export interface AdvancedReportData {
  period: string;
  totalRevenue: number;
  totalAppointments: number;
  averageTicket: number;
  completionRate: number;
  cancellationRate: number;
  newClients: number;
  returningClients: number;
  popularServices: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  professionalPerformance: Array<{
    name: string;
    appointments: number;
    revenue: number;
    rating: number;
  }>;
  hourlyDistribution: Array<{
    hour: string;
    appointments: number;
  }>;
  dailyDistribution: Array<{
    day: string;
    appointments: number;
    revenue: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    appointments: number;
  }>;
}

export const useAdvancedReports = (dateRange: { from: Date; to: Date }) => {
  const [data, setData] = useState<AdvancedReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  const fetchAdvancedReports = async () => {
    if (!businessId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulando dados avançados de relatórios
      const mockData: AdvancedReportData = {
        period: `${dateRange.from.toISOString().split('T')[0]} - ${dateRange.to.toISOString().split('T')[0]}`,
        totalRevenue: 15750.00,
        totalAppointments: 185,
        averageTicket: 85.14,
        completionRate: 92.4,
        cancellationRate: 7.6,
        newClients: 23,
        returningClients: 162,
        popularServices: [
          { name: 'Corte Masculino', count: 65, revenue: 3250.00 },
          { name: 'Barba', count: 45, revenue: 1350.00 },
          { name: 'Corte + Barba', count: 32, revenue: 2560.00 },
          { name: 'Coloração', count: 28, revenue: 4200.00 },
          { name: 'Hidratação', count: 15, revenue: 1200.00 },
        ],
        professionalPerformance: [
          { name: 'João Silva', appointments: 52, revenue: 4680.00, rating: 4.9 },
          { name: 'Maria Santos', appointments: 48, revenue: 4320.00, rating: 4.8 },
          { name: 'Pedro Costa', appointments: 42, revenue: 3780.00, rating: 4.7 },
          { name: 'Ana Oliveira', appointments: 43, revenue: 2970.00, rating: 4.6 },
        ],
        hourlyDistribution: [
          { hour: '08:00', appointments: 8 },
          { hour: '09:00', appointments: 15 },
          { hour: '10:00', appointments: 22 },
          { hour: '11:00', appointments: 18 },
          { hour: '14:00', appointments: 25 },
          { hour: '15:00', appointments: 28 },
          { hour: '16:00', appointments: 32 },
          { hour: '17:00', appointments: 24 },
          { hour: '18:00', appointments: 13 },
        ],
        dailyDistribution: [
          { day: 'Segunda', appointments: 32, revenue: 2720.00 },
          { day: 'Terça', appointments: 28, revenue: 2380.00 },
          { day: 'Quarta', appointments: 35, revenue: 2975.00 },
          { day: 'Quinta', appointments: 30, revenue: 2550.00 },
          { day: 'Sexta', appointments: 38, revenue: 3230.00 },
          { day: 'Sábado', appointments: 22, revenue: 1895.00 },
        ],
        paymentMethods: [
          { method: 'Cartão de Crédito', count: 78, percentage: 42.2 },
          { method: 'PIX', count: 56, percentage: 30.3 },
          { method: 'Dinheiro', count: 28, percentage: 15.1 },
          { method: 'Cartão de Débito', count: 23, percentage: 12.4 },
        ],
        monthlyTrend: [
          { month: 'Jan', revenue: 12500.00, appointments: 145 },
          { month: 'Fev', revenue: 14200.00, appointments: 168 },
          { month: 'Mar', revenue: 15750.00, appointments: 185 },
          { month: 'Abr', revenue: 13800.00, appointments: 162 },
          { month: 'Mai', revenue: 16200.00, appointments: 195 },
          { month: 'Jun', revenue: 15750.00, appointments: 185 },
        ],
      };

      setData(mockData);
      console.log('Relatórios avançados carregados:', mockData);
    } catch (err) {
      console.error('Erro ao carregar relatórios avançados:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatórios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvancedReports();
  }, [businessId, dateRange]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchAdvancedReports,
  };
};
