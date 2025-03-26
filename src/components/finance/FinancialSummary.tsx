
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { TrendingUp, TrendingDown, CalendarRange, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
          .gte('criado_em', thirtyDaysAgo.toISOString());
        
        if (receitasError) throw receitasError;
        
        // Buscar despesas
        const { data: despesasData, error: despesasError } = await supabase
          .from('transacoes')
          .select('valor')
          .eq('tipo', 'despesa')
          .eq('status', 'approved')
          .gte('criado_em', thirtyDaysAgo.toISOString());
        
        if (despesasError) throw despesasError;
        
        // Buscar transações pendentes
        const { data: pendentesData, error: pendentesError } = await supabase
          .from('transacoes')
          .select('id')
          .eq('status', 'pending')
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
    
    if (!isLoading) {
      fetchSummaryData();
    }
  }, [isLoading]);
  
  const currentMonth = format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Receitas</p>
              {isLoading ? (
                <Skeleton className="h-7 w-24 mt-1" />
              ) : (
                <h3 className="text-2xl font-bold text-green-600">{formatCurrency(summaryData.receitas)}</h3>
              )}
              <p className="text-xs text-muted-foreground mt-1">{currentMonth}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Despesas</p>
              {isLoading ? (
                <Skeleton className="h-7 w-24 mt-1" />
              ) : (
                <h3 className="text-2xl font-bold text-red-600">{formatCurrency(summaryData.despesas)}</h3>
              )}
              <p className="text-xs text-muted-foreground mt-1">{currentMonth}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saldo</p>
              {isLoading ? (
                <Skeleton className="h-7 w-24 mt-1" />
              ) : (
                <h3 className={`text-2xl font-bold ${summaryData.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summaryData.saldo)}
                </h3>
              )}
              <p className="text-xs text-muted-foreground mt-1">{currentMonth}</p>
            </div>
            <div className={`h-12 w-12 rounded-full ${summaryData.saldo >= 0 ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
              <Wallet className={`h-6 w-6 ${summaryData.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
              {isLoading ? (
                <Skeleton className="h-7 w-24 mt-1" />
              ) : (
                <h3 className="text-2xl font-bold text-amber-600">{summaryData.transacoesPendentes}</h3>
              )}
              <p className="text-xs text-muted-foreground mt-1">Transações</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <CalendarRange className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
