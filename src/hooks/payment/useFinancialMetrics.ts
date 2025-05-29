
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
  mrr: number;
  arr: number;
  activeSubscriptions: number;
  customerLifetimeValue: number;
  conversionRate: number;
  churnRate: number;
  avgRevenuePerCustomer: number;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
  subscriptions?: number;
}

export const useFinancialMetrics = (dateRange?: { start: Date; end: Date }) => {
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    clientCount: 0,
    averageTicket: 0,
    monthlyGrowth: 0,
    mrr: 0,
    arr: 0,
    activeSubscriptions: 0,
    customerLifetimeValue: 0,
    conversionRate: 0,
    churnRate: 0,
    avgRevenuePerCustomer: 0,
  });
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const refreshMetrics = async (dateRangeParam?: { start: Date; end: Date }) => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }

    try {
      // Calculate date range based on dateRange or provided range
      const now = new Date();
      let startDate: Date;
      let endDate: Date = dateRangeParam?.end || dateRange?.end || now;

      if (dateRangeParam) {
        startDate = dateRangeParam.start;
      } else if (dateRange) {
        startDate = dateRange.start;
      } else {
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

      // Calculate additional metrics (with placeholder values for now)
      const mrr = totalRevenue; // Monthly recurring revenue
      const arr = mrr * 12; // Annual recurring revenue
      const activeSubscriptions = clientCount; // Placeholder
      const customerLifetimeValue = averageTicket * 12; // Placeholder calculation
      const conversionRate = clientCount > 0 ? (bookings.length / clientCount) * 100 : 0;
      const churnRate = 5; // Placeholder 5%
      const avgRevenuePerCustomer = clientCount > 0 ? totalRevenue / clientCount : 0;

      setMetrics({
        totalRevenue,
        totalExpenses,
        netProfit,
        clientCount,
        averageTicket,
        monthlyGrowth,
        mrr,
        arr,
        activeSubscriptions,
        customerLifetimeValue,
        conversionRate,
        churnRate,
        avgRevenuePerCustomer,
      });

      // Generate chart data (placeholder)
      const chartData: RevenueChartData[] = [
        { month: 'Jan', revenue: totalRevenue * 0.8, subscriptions: activeSubscriptions * 0.9 },
        { month: 'Feb', revenue: totalRevenue * 0.9, subscriptions: activeSubscriptions * 0.95 },
        { month: 'Mar', revenue: totalRevenue, subscriptions: activeSubscriptions },
      ];
      setRevenueChartData(chartData);

      setError(null);
    } catch (err: any) {
      console.error('Error fetching financial metrics:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshMetrics();
  }, [businessId, dateRange]);

  return { metrics, revenueChartData, refreshMetrics, isLoading, error };
};
