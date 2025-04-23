import { useState, useEffect } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialChartProps {
  businessId: string | null;
}

export const FinancialChart = ({ businessId }: FinancialChartProps) => {
  const [financialData, setFinancialData] = useState<Array<{ day: string, value: number }>>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFinancialData = async () => {
      if (!businessId) return;
      
      try {
        setLoading(true);
        
        // Configurar datas para a semana atual
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
        
        const startDate = weekStart.toISOString().split('T')[0];
        const endDate = weekEnd.toISOString().split('T')[0];
        
        // Buscar as transações da semana
        const { data, error } = await supabase
          .from('transacoes')
          .select('data_pagamento, valor')
          .eq('id_negocio', businessId)
          .eq('tipo', 'receita')
          .gte('data_pagamento', startDate)
          .lte('data_pagamento', endDate);
          
        if (error) {
          throw error;
        }
        
        // Criar estrutura de dados para cada dia da semana
        const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
        const chartData = daysOfWeek.map(day => {
          const dayStr = format(day, 'eee', { locale: pt }).charAt(0).toUpperCase() + format(day, 'eee', { locale: pt }).slice(1, 3);
          
          // Filtra transações para este dia
          const dayTransactions = data.filter(transaction => {
            const transactionDate = parseISO(transaction.data_pagamento);
            return transactionDate.getDate() === day.getDate() && 
                   transactionDate.getMonth() === day.getMonth() && 
                   transactionDate.getFullYear() === day.getFullYear();
          });
          
          // Soma os valores das transações do dia
          const dayTotal = dayTransactions.reduce((sum, transaction) => sum + transaction.valor, 0);
          
          return {
            day: dayStr,
            value: dayTotal
          };
        });
        
        setFinancialData(chartData);
      } catch (error) {
        console.error("Erro ao buscar dados financeiros:", error);
        // Fallback para dados vazios
        const daysOfWeek = eachDayOfInterval({
          start: startOfWeek(new Date(), { weekStartsOn: 0 }),
          end: endOfWeek(new Date(), { weekStartsOn: 0 })
        });
        
        const emptyData = daysOfWeek.map(day => ({
          day: format(day, 'eee', { locale: pt }).charAt(0).toUpperCase() + format(day, 'eee', { locale: pt }).slice(1, 3),
          value: 0
        }));
        
        setFinancialData(emptyData);
      } finally {
        setLoading(false);
      }
    };
    
    if (businessId) {
      fetchFinancialData();
    }
  }, [businessId]);
  
  const formatCurrency = (value: number) => 
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
  const totalRevenue = financialData.reduce((sum, item) => sum + item.value, 0);
  
  if (loading) {
    return (
      <Card className="animated-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-24 mt-1" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] mt-4">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="animated-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Movimentação Financeira</CardTitle>
            <CardDescription>Visão semanal de receitas</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-semibold">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={financialData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f6f95" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f6f95" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                hide={true}
                domain={[0, 'dataMax + 30']}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Receita"]} 
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  padding: "0.5rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4f6f95"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
