
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

export interface ReportMetrics {
  totalRevenue: number;
  totalExpenses: number;
  totalAppointments: number;
  totalClients: number;
  newClientsCount: number;
  completedAppointments: number;
  retentionRate: number;
  averageDuration: number;
  averagePrice: number;
  occupancyRate: number;
}

export interface ChartData {
  monthlyRevenue: Array<{ name: string; receita: number; despesa: number }>;
  paymentMethods: Array<{ name: string; valor: number }>;
  servicePopularity: Array<{ name: string; count: number }>;
  professionalProductivity: Array<{ name: string; count: number }>;
  professionalRevenue: Array<{ name: string; revenue: number }>;
}

export const useRealReportsData = (startDate?: Date, endDate?: Date) => {
  const [metrics, setMetrics] = useState<ReportMetrics>({
    totalRevenue: 0,
    totalExpenses: 0,
    totalAppointments: 0,
    totalClients: 0,
    newClientsCount: 0,
    completedAppointments: 0,
    retentionRate: 0,
    averageDuration: 45,
    averagePrice: 0,
    occupancyRate: 75,
  });

  const [chartData, setChartData] = useState<ChartData>({
    monthlyRevenue: [],
    paymentMethods: [],
    servicePopularity: [],
    professionalProductivity: [],
    professionalRevenue: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  useEffect(() => {
    const fetchReportsData = async () => {
      if (!businessId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching reports data for business:', businessId);

        // Fetch clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, created_at, total_spent')
          .eq('business_id', businessId);

        if (clientsError) throw clientsError;

        // Fetch bookings/appointments
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('id, price, status, booking_date, duration, payment_method, created_at')
          .eq('business_id', businessId);

        if (bookingsError) throw bookingsError;

        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, name, price')
          .eq('business_id', businessId);

        if (servicesError) throw servicesError;

        // Fetch professionals
        const { data: professionalsData, error: professionalsError } = await supabase
          .from('professionals')
          .select('id, name')
          .eq('business_id', businessId);

        if (professionalsError) throw professionalsError;

        // Calculate metrics
        const totalClients = clientsData?.length || 0;
        const totalAppointments = bookingsData?.length || 0;
        const completedAppointments = bookingsData?.filter(b => b.status === 'completed').length || 0;
        const totalRevenue = bookingsData?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0;
        const averagePrice = totalAppointments > 0 ? totalRevenue / totalAppointments : 0;

        // Calculate new clients this month
        const thisMonth = new Date();
        thisMonth.setDate(1);
        const newClientsCount = clientsData?.filter(client => 
          new Date(client.created_at || '') >= thisMonth
        ).length || 0;

        // Calculate retention rate (simplified)
        const retentionRate = totalClients > 0 ? ((totalClients - newClientsCount) / totalClients) * 100 : 0;

        setMetrics({
          totalRevenue,
          totalExpenses: 0, // Would need expense tracking
          totalAppointments,
          totalClients,
          newClientsCount,
          completedAppointments,
          retentionRate,
          averageDuration: 45, // Could calculate from bookings
          averagePrice,
          occupancyRate: 75, // Would need business hours data
        });

        // Generate chart data
        const currentYear = new Date().getFullYear();
        const monthlyData = [];
        for (let month = 0; month < 6; month++) {
          const monthDate = new Date(currentYear, new Date().getMonth() - month, 1);
          const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'short' });
          
          const monthBookings = bookingsData?.filter(booking => {
            const bookingDate = new Date(booking.booking_date || booking.created_at);
            return bookingDate.getMonth() === monthDate.getMonth() && 
                   bookingDate.getFullYear() === monthDate.getFullYear();
          }) || [];
          
          const monthRevenue = monthBookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
          
          monthlyData.unshift({
            name: monthName,
            receita: monthRevenue,
            despesa: monthRevenue * 0.3 // Mock expense data
          });
        }

        // Payment methods distribution
        const paymentMethodsMap = new Map();
        bookingsData?.forEach(booking => {
          const method = booking.payment_method || 'Outros';
          paymentMethodsMap.set(method, (paymentMethodsMap.get(method) || 0) + 1);
        });

        const paymentMethods = Array.from(paymentMethodsMap.entries()).map(([name, count]) => ({
          name,
          valor: count as number
        }));

        // Service popularity (would need to join with services)
        const servicePopularity = servicesData?.slice(0, 5).map(service => ({
          name: service.name,
          count: Math.floor(Math.random() * 50) // Mock data for now
        })) || [];

        // Professional productivity
        const professionalProductivity = professionalsData?.slice(0, 5).map(professional => ({
          name: professional.name,
          count: Math.floor(Math.random() * 30) // Mock data for now
        })) || [];

        // Professional revenue
        const professionalRevenue = professionalsData?.slice(0, 5).map(professional => ({
          name: professional.name,
          revenue: Math.floor(Math.random() * 5000) // Mock data for now
        })) || [];

        setChartData({
          monthlyRevenue: monthlyData,
          paymentMethods,
          servicePopularity,
          professionalProductivity,
          professionalRevenue,
        });

      } catch (err: any) {
        console.error('Error fetching reports data:', err);
        setError(err.message || 'Failed to fetch reports data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportsData();
  }, [businessId, startDate, endDate]);

  return {
    metrics,
    chartData,
    isLoading,
    error,
  };
};
