
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

interface FinancialChartData {
  name: string;
  receita: number;
  despesa: number;
}

export interface UseFinancialDataReturn {
  chartData: FinancialChartData[];
  isLoading: boolean;
  error: string | null;
  totalReceita: number;
  totalDespesa: number;
}

export const useFinancialData = (): UseFinancialDataReturn => {
  const [chartData, setChartData] = useState<FinancialChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  useEffect(() => {
    const loadFinancialData = async () => {
      if (!businessId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('Loading financial data for business:', businessId);

        // Buscar pagamentos dos últimos 6 meses
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const { data: payments, error: paymentsError } = await supabase
          .from('payments')
          .select('amount, status, payment_date, created_at')
          .eq('business_id', businessId)
          .eq('status', 'paid')
          .gte('payment_date', sixMonthsAgo.toISOString())
          .order('payment_date', { ascending: true });

        if (paymentsError) {
          console.error('Error fetching payments:', paymentsError);
          throw paymentsError;
        }

        console.log('Fetched payments:', payments);

        // Se não há pagamentos, criar dados dos últimos 6 meses com valores zero
        if (!payments || payments.length === 0) {
          const emptyData = generateEmptyMonthlyData();
          setChartData(emptyData);
          setIsLoading(false);
          return;
        }

        // Processar pagamentos por mês
        const monthlyData = processPaymentsByMonth(payments);
        setChartData(monthlyData);

      } catch (err) {
        console.error('Error loading financial data:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados financeiros');
        
        // Em caso de erro, mostrar dados vazios
        const emptyData = generateEmptyMonthlyData();
        setChartData(emptyData);
      } finally {
        setIsLoading(false);
      }
    };

    loadFinancialData();
  }, [businessId]);

  // Calcular totais
  const totalReceita = chartData.reduce((sum, month) => sum + month.receita, 0);
  const totalDespesa = chartData.reduce((sum, month) => sum + month.despesa, 0);

  return {
    chartData,
    isLoading,
    error,
    totalReceita,
    totalDespesa,
  };
};

// Função para gerar dados vazios dos últimos 6 meses
const generateEmptyMonthlyData = (): FinancialChartData[] => {
  const data: FinancialChartData[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
    
    data.push({
      name: monthName,
      receita: 0,
      despesa: 0,
    });
  }

  return data;
};

// Função para processar pagamentos por mês
const processPaymentsByMonth = (payments: any[]): FinancialChartData[] => {
  const monthlyMap = new Map<string, { receita: number; despesa: number }>();
  
  // Inicializar os últimos 6 meses
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    monthlyMap.set(key, { receita: 0, despesa: 0 });
  }

  // Processar pagamentos (todos são receitas no schema atual)
  payments.forEach(payment => {
    const date = new Date(payment.payment_date || payment.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (monthlyMap.has(key)) {
      const monthData = monthlyMap.get(key)!;
      monthData.receita += Number(payment.amount) || 0;
    }
  });

  // Converter para array final
  const result: FinancialChartData[] = [];
  const sortedKeys = Array.from(monthlyMap.keys()).sort();
  
  sortedKeys.forEach(key => {
    const [year, month] = key.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
    const data = monthlyMap.get(key)!;
    
    result.push({
      name: monthName,
      receita: data.receita,
      despesa: data.despesa,
    });
  });

  return result;
};
