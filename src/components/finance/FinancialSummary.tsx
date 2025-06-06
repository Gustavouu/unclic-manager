
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { TrendingUp, TrendingDown, CalendarRange, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StatsCard } from "@/components/common/StatsCard";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

interface FinancialSummaryProps {
  isLoading: boolean;
}

export function FinancialSummary({ isLoading }: FinancialSummaryProps) {
  const [summaryData, setSummaryData] = useState({
    receitas: 0,
    despesas: 0,
    saldo: 0,
    transacoesPendentes: 0
  });
  const { businessId } = useCurrentBusiness();
  
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Buscar receitas do período (usando payments table)
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('amount, status')
          .eq('business_id', businessId)
          .eq('status', 'paid')
          .gte('payment_date', thirtyDaysAgo.toISOString());
        
        if (paymentsError) throw paymentsError;
        
        // Buscar transações pendentes
        const { data: pendingData, error: pendingError } = await supabase
          .from('payments')
          .select('id')
          .eq('business_id', businessId)
          .eq('status', 'pending')
          .gte('payment_date', thirtyDaysAgo.toISOString());
        
        if (pendingError) throw pendingError;
        
        // Calcular totais
        const totalReceitas = paymentsData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        
        setSummaryData({
          receitas: totalReceitas,
          despesas: 0, // No expense tracking in current schema
          saldo: totalReceitas,
          transacoesPendentes: pendingData?.length || 0
        });
      } catch (error) {
        console.error("Erro ao buscar dados do resumo financeiro:", error);
      }
    };
    
    if (!isLoading && businessId) {
      fetchSummaryData();
    }
  }, [isLoading, businessId]);
  
  const currentMonth = format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full" />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard 
        title="Receitas"
        value={formatCurrency(summaryData.receitas)}
        description={currentMonth}
        icon={<TrendingUp size={18} />}
        iconColor="bg-green-50 text-green-500"
        borderColor="border-l-green-600"
      />
      
      <StatsCard 
        title="Despesas"
        value={formatCurrency(summaryData.despesas)}
        description={currentMonth}
        icon={<TrendingDown size={18} />}
        iconColor="bg-red-50 text-red-500"
        borderColor="border-l-red-600"
      />
      
      <StatsCard 
        title="Saldo"
        value={formatCurrency(summaryData.saldo)}
        description={currentMonth}
        icon={<Wallet size={18} />}
        iconColor={summaryData.saldo >= 0 ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"}
        borderColor={summaryData.saldo >= 0 ? "border-l-green-600" : "border-l-red-600"}
      />
      
      <StatsCard 
        title="Pendentes"
        value={summaryData.transacoesPendentes.toString()}
        description="Transações"
        icon={<CalendarRange size={18} />}
        iconColor="bg-amber-50 text-amber-500"
        borderColor="border-l-amber-600"
      />
    </div>
  );
}
