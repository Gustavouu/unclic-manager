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
        
        // Buscar receitas
        const { data: receitasData, error: receitasError } = await supabase
          .from('transacoes')
          .select('valor')
          .eq('tipo', 'receita')
          .eq('status', 'approved')
          .eq('id_negocio', businessId)
          .gte('criado_em', thirtyDaysAgo.toISOString());
        
        if (receitasError) throw receitasError;
        
        // Buscar despesas
        const { data: despesasData, error: despesasError } = await supabase
          .from('transacoes')
          .select('valor')
          .eq('tipo', 'despesa')
          .eq('status', 'approved')
          .eq('id_negocio', businessId)
          .gte('criado_em', thirtyDaysAgo.toISOString());
        
        if (despesasError) throw despesasError;
        
        // Buscar transações pendentes
        const { data: pendentesData, error: pendentesError } = await supabase
          .from('transacoes')
          .select('id')
          .eq('status', 'pending')
          .eq('id_negocio', businessId)
          .gte('criado_em', thirtyDaysAgo.toISOString());
        
        if (pendentesError) throw pendentesError;
        
        // Calcular totais
        const totalReceitas = receitasData.reduce((sum, item) => sum + Number(item.valor), 0);
        const totalDespesas = despesasData.reduce((sum, item) => sum + Number(item.valor), 0);
        
        setSummaryData({
          receitas: totalReceitas,
          despesas: totalDespesas,
          saldo: totalReceitas - totalDespesas,
          transacoesPendentes: pendentesData.length
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
