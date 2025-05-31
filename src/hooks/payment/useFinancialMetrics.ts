
import { useState, useEffect } from 'react';

export interface FinancialMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  averageTicket: number;
}

export function useFinancialMetrics() {
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalTransactions: 0,
    averageTicket: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // This would fetch real metrics from the API
    setMetrics({
      totalRevenue: 15420.50,
      monthlyRevenue: 3240.80,
      totalTransactions: 145,
      averageTicket: 106.35,
    });
  }, []);

  return {
    metrics,
    isLoading,
    error,
  };
}
