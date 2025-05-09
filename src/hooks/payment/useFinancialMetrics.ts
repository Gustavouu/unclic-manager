
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

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

export function useFinancialMetrics(dateRange?: { start: Date; end: Date }) {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { businessId } = useCurrentBusiness();

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

      // Get all paid invoices in the date range
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('amount, paid_date, status, subscription_id, customer_id')
        .eq('status', 'paid')
        .gte('paid_date', startStr)
        .lte('paid_date', endStr)
        .order('paid_date', { ascending: true });

      if (invoicesError) {
        throw new Error(`Failed to fetch invoices: ${invoicesError.message}`);
      }

      // Get active subscriptions
      const { data: subscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('id, start_date, status, customer_id')
        .in('status', ['active', 'trialing'])
        .order('start_date', { ascending: true });

      if (subsError) {
        throw new Error(`Failed to fetch subscriptions: ${subsError.message}`);
      }

      // Get all customers
      const { data: customers, error: customersError } = await supabase
        .from('clientes')
        .select('id');

      if (customersError) {
        throw new Error(`Failed to fetch customers: ${customersError.message}`);
      }

      // Get canceled subscriptions in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

      const { data: canceledSubs, error: canceledSubsError } = await supabase
        .from('subscriptions')
        .select('id, canceled_at')
        .eq('status', 'canceled')
        .gte('canceled_at', thirtyDaysAgoStr);

      if (canceledSubsError) {
        throw new Error(`Failed to fetch canceled subscriptions: ${canceledSubsError.message}`);
      }

      // Calculate total revenue
      const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

      // Calculate MRR (Monthly Recurring Revenue) - using current active subscriptions
      const { data: plans, error: plansError } = await supabase
        .from('subscription_plans')
        .select('id, price, interval, interval_count');

      if (plansError) {
        throw new Error(`Failed to fetch plans: ${plansError.message}`);
      }

      // Get all active subscriptions with their plans
      const { data: activeSubsWithPlans, error: activeSubsError } = await supabase
        .from('subscriptions')
        .select(`
          id,
          plan_id,
          subscription_plans(price, interval, interval_count)
        `)
        .in('status', ['active', 'trialing']);

      if (activeSubsError) {
        throw new Error(`Failed to fetch active subscriptions with plans: ${activeSubsError.message}`);
      }

      // Calculate MRR by normalizing all subscription plans to monthly revenue
      let mrr = 0;
      for (const sub of activeSubsWithPlans) {
        // The issue is here - subscription_plans is returned as an object by Supabase's join
        // but we need to handle it properly based on its actual structure

        // First, check if subscription_plans exists and what type it is
        const planData = sub.subscription_plans;
        
        // If planData is null or undefined, skip this subscription
        if (!planData) continue;
        
        // Check if planData is an array or a single object and extract values accordingly
        let price = 0;
        let interval = 'month';
        let intervalCount = 1;
        
        if (Array.isArray(planData) && planData.length > 0) {
          // If it's an array (like in some Supabase joins), take the first item
          price = Number(planData[0].price || 0);
          interval = String(planData[0].interval || 'month');
          intervalCount = Number(planData[0].interval_count || 1);
        } else {
          // If it's a direct object (single record join)
          // Use type assertion to tell TypeScript it's an object with specific properties
          const planObj = planData as unknown as { price: any; interval: any; interval_count: any };
          price = Number(planObj.price || 0);
          interval = String(planObj.interval || 'month');
          intervalCount = Number(planObj.interval_count || 1);
        }

        // Convert price to monthly equivalent
        switch (interval) {
          case 'day':
            mrr += (price * 30) / intervalCount;
            break;
          case 'week':
            mrr += (price * 4) / intervalCount;
            break;
          case 'month':
            mrr += price / intervalCount;
            break;
          case 'year':
            mrr += price / (12 * intervalCount);
            break;
        }
      }

      // ARR is just MRR * 12
      const arr = mrr * 12;

      // Active subscriptions count
      const activeSubscriptions = subscriptions.length;

      // Calculate conversion rate (active subscriptions / total customers)
      const conversionRate = customers.length > 0 
        ? (activeSubscriptions / customers.length) * 100 
        : 0;

      // Calculate churn rate (canceled in last 30 days / total active at start of period)
      const totalSubscriptionsAtStartOfPeriod = activeSubscriptions + canceledSubs.length;
      const churnRate = totalSubscriptionsAtStartOfPeriod > 0 
        ? (canceledSubs.length / totalSubscriptionsAtStartOfPeriod) * 100 
        : 0;

      // Average revenue per customer
      const avgRevenuePerCustomer = activeSubscriptions > 0 ? mrr / activeSubscriptions : 0;

      // Customer lifetime value (avg revenue per customer / churn rate) * profit margin
      // Assuming 80% profit margin for subscription business
      const profitMargin = 0.8;
      const customerLifetimeValue = churnRate > 0 
        ? (avgRevenuePerCustomer / (churnRate / 100)) * profitMargin 
        : 0;

      // Generate revenue chart data (last 6 months)
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
