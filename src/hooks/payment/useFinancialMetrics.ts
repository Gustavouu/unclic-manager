
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  clientCount: number;
  averageTicket: number;
  monthlyGrowth: number;
}

export const useFinancialMetrics = (period: string = 'month') => {
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    clientCount: 0,
    averageTicket: 0,
    monthlyGrowth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!businessId) {
        setIsLoading(false);
        return;
      }

      try {
        // Calculate date range based on period
        const now = new Date();
        let startDate: Date;

        switch (period) {
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

        // Fetch revenue from bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('price, created_at')
          .eq('business_id', businessId)
          .gte('created_at', startDate.toISOString())
          .eq('status', 'completed');

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
        }

        // Use the correct clients table name
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, created_at')
          .eq('business_id', businessId)
          .gte('created_at', startDate.toISOString());

        if (clientsError) {
          console.error('Error fetching clients:', clientsError);
        }

        const bookings = bookingsData || [];
        const clients = clientsData || [];

        const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
        const clientCount = clients.length;
        const averageTicket = bookings.length > 0 ? totalRevenue / bookings.length : 0;

        // For now, set expenses to 0 since we don't have expense data
        const totalExpenses = 0;
        const netProfit = totalRevenue - totalExpenses;

        // Calculate previous period for growth comparison
        const previousStartDate = new Date(startDate);
        previousStartDate.setMonth(previousStartDate.getMonth() - 1);

        const { data: previousBookings } = await supabase
          .from('bookings')
          .select('price')
          .eq('business_id', businessId)
          .gte('created_at', previousStartDate.toISOString())
          .lt('created_at', startDate.toISOString())
          .eq('status', 'completed');

        const previousRevenue = (previousBookings || []).reduce((sum, booking) => sum + (booking.price || 0), 0);
        const monthlyGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

        setMetrics({
          totalRevenue,
          totalExpenses,
          netProfit,
          clientCount,
          averageTicket,
          monthlyGrowth,
        });

        setError(null);
      } catch (err: any) {
        console.error('Error fetching financial metrics:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [businessId, period]);

  return { metrics, isLoading, error };
};
