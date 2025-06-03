
import { useState, useEffect } from 'react';

export interface FinancialMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  averageTicket: number;
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
  subscriptions: number;
}

interface DateRange {
  start: Date;
  end: Date;
}

export function useFinancialMetrics(dateRange?: DateRange) {
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalTransactions: 0,
    averageTicket: 0,
    mrr: 0,
    arr: 0,
    activeSubscriptions: 0,
    customerLifetimeValue: 0,
    conversionRate: 0,
    churnRate: 0,
    avgRevenuePerCustomer: 0,
  });
  
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshMetrics = () => {
    // Simulate refresh - in real implementation would refetch data
    setMetrics({
      totalRevenue: 15420.50,
      monthlyRevenue: 3240.80,
      totalTransactions: 145,
      averageTicket: 106.35,
      mrr: 2500.00,
      arr: 30000.00,
      activeSubscriptions: 25,
      customerLifetimeValue: 1200.00,
      conversionRate: 15.5,
      churnRate: 2.1,
      avgRevenuePerCustomer: 85.50,
    });
    
    // Mock chart data
    setRevenueChartData([
      { month: 'Jan', revenue: 4000, subscriptions: 20 },
      { month: 'Fev', revenue: 3000, subscriptions: 22 },
      { month: 'Mar', revenue: 5000, subscriptions: 25 },
      { month: 'Abr', revenue: 4500, subscriptions: 24 },
      { month: 'Mai', revenue: 6000, subscriptions: 28 },
      { month: 'Jun', revenue: 5500, subscriptions: 30 },
    ]);
  };

  useEffect(() => {
    refreshMetrics();
  }, [dateRange]);

  return {
    metrics,
    revenueChartData,
    isLoading,
    error,
    refreshMetrics,
  };
}
