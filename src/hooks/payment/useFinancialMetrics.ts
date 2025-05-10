
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { 
  calculateARR, calculateChurnRate, calculateConversionRate, calculateARPC, calculateCLV 
} from '@/utils/financialCalculations';
import { 
  fetchActiveSubscriptionsWithPlans, calculateMonthlyRecurringRevenue, SubscriptionWithPlan 
} from '@/hooks/payment/useSubscriptionData';

export interface FinancialMetrics {
  totalRevenue: number;
  mrr: number;
  arr: number;
  activeSubscriptions: number;
  conversionRate: number;
  churnRate: number;
  avgRevenuePerCustomer: number;
  customerLifetimeValue: number;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
  subscriptions: number;
}

/**
 * Fetches and calculates financial metrics for the current business
 */
export function useFinancialMetrics(dateRange?: { start: Date; end: Date }) {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { businessId } = useCurrentBusiness();

  // Função para obter todas as faturas pagas no período
  async function fetchPaidInvoices(startStr: string, endStr: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('amount, paid_date, status, subscription_id, customer_id')
      .eq('status', 'paid')
      .gte('paid_date', startStr)
      .lte('paid_date', endStr)
      .order('paid_date', { ascending: true });
      
    if (error) {
      throw new Error(`Failed to fetch invoices: ${error.message}`);
    }
    
    return data || [];
  }
  
  // Função para obter assinaturas ativas
  async function fetchActiveSubscriptions() {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id, start_date, status, customer_id')
      .in('status', ['active', 'trialing'])
      .order('start_date', { ascending: true });
      
    if (error) {
      throw new Error(`Failed to fetch subscriptions: ${error.message}`);
    }
    
    return data || [];
  }
  
  // Função para obter assinaturas canceladas
  async function fetchCanceledSubscriptions(thirtyDaysAgoStr: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id, canceled_at')
      .eq('status', 'canceled')
      .gte('canceled_at', thirtyDaysAgoStr);
      
    if (error) {
      throw new Error(`Failed to fetch canceled subscriptions: ${error.message}`);
    }
    
    return data || [];
  }
  
  // Função para obter todos os clientes
  async function fetchCustomers() {
    const { data, error } = await supabase
      .from('clientes')
      .select('id');
      
    if (error) {
      throw new Error(`Failed to fetch customers: ${error.message}`);
    }
    
    return data || [];
  }

  // Função para gerar dados do gráfico de receita
  function generateRevenueChartData(invoices: any[], subscriptions: any[]) {
    const chartData: RevenueChartData[] = [];
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      months.push({
        date: monthDate,
        month: monthDate.toLocaleString('default', { month: 'short' }),
        year: monthDate.getFullYear()
      });
    }

    for (const monthInfo of months) {
      const monthStart = new Date(monthInfo.year, monthInfo.date.getMonth(), 1);
      const monthEnd = new Date(monthInfo.year, monthInfo.date.getMonth() + 1, 0);

      const monthInvoices = invoices.filter(inv => {
        const paidDate = new Date(inv.paid_date!);
        return paidDate >= monthStart && paidDate <= monthEnd;
      });

      const monthRevenue = monthInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
      
      const monthSubscriptions = subscriptions.filter(sub => {
        const startDate = new Date(sub.start_date);
        return startDate <= monthEnd;
      }).length;

      chartData.push({
        month: `${monthInfo.month} ${monthInfo.year}`,
        revenue: monthRevenue,
        subscriptions: monthSubscriptions
      });
    }
    
    return chartData;
  }

  const calculateMetrics = async () => {
    if (!businessId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Calculate date range
      const now = new Date();
      const startDate = dateRange?.start || new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const endDate = dateRange?.end || now;
      
      // Format dates for query
      const startStr = startDate.toISOString();
      const endStr = endDate.toISOString();
      
      // Get data for last 30 days for churn calculation
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

      // Fetch all required data
      const invoices = await fetchPaidInvoices(startStr, endStr);
      const subscriptions = await fetchActiveSubscriptions();
      const customers = await fetchCustomers();
      const canceledSubs = await fetchCanceledSubscriptions(thirtyDaysAgoStr);
      const activeSubsWithPlans = await fetchActiveSubscriptionsWithPlans();
      
      // Calculate metrics
      const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
      const mrr = calculateMonthlyRecurringRevenue(activeSubsWithPlans);
      const arr = calculateARR(mrr);
      const activeSubscriptions = subscriptions.length;
      const conversionRate = calculateConversionRate(activeSubscriptions, customers.length);
      const churnRate = calculateChurnRate(canceledSubs.length, activeSubscriptions);
      const avgRevenuePerCustomer = calculateARPC(mrr, activeSubscriptions);
      const customerLifetimeValue = calculateCLV(avgRevenuePerCustomer, churnRate);
      
      // Gerar dados do gráfico de receita
      const chartData = generateRevenueChartData(invoices, subscriptions);

      setMetrics({
        totalRevenue,
        mrr,
        arr,
        activeSubscriptions,
        conversionRate,
        churnRate,
        avgRevenuePerCustomer,
        customerLifetimeValue
      });
      setRevenueChartData(chartData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to calculate financial metrics'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      calculateMetrics();
    }
  }, [businessId, dateRange]);

  return {
    metrics,
    revenueChartData,
    isLoading,
    error,
    refreshMetrics: calculateMetrics
  };
}
