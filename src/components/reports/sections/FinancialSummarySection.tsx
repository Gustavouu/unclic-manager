
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, ShoppingBag, AlertCircle } from "lucide-react";
import { ReportStatistics } from "@/hooks/reports/useReportsData";

interface FinancialSummarySectionProps {
  dateRange: string;
  stats: ReportStatistics;
}

export function FinancialSummarySection({ dateRange, stats }: FinancialSummarySectionProps) {
  // Format currency values
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };
  
  // Calculate expense (simplified)
  const estimatedExpense = Math.round(stats.totalRevenue * 0.4); // Simplified calculation
  const profit = stats.totalRevenue - estimatedExpense;
  const accountsReceivable = Math.round(stats.totalRevenue * 0.15); // Simplified calculation
  
  // Calculate trend indicators (simplified for demonstration)
  const revenueTrend = 12.5;
  const expenseTrend = 2.3;
  const profitTrend = 18.2;
  const receivableTrend = -5.1;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-full">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div className="text-sm text-green-600 flex items-center">
            <span>+{revenueTrend}%</span>
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Receita Total</p>
          <h3 className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-red-100 p-2 rounded-full">
            <ShoppingBag className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-sm text-red-600 flex items-center">
            <span>+{expenseTrend}%</span>
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Despesas</p>
          <h3 className="text-2xl font-bold">{formatCurrency(estimatedExpense)}</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-green-100 p-2 rounded-full">
            <CreditCard className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-sm text-green-600 flex items-center">
            <span>+{profitTrend}%</span>
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Lucro Líquido</p>
          <h3 className="text-2xl font-bold">{formatCurrency(profit)}</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-amber-100 p-2 rounded-full">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-sm text-amber-600 flex items-center">
            <span>{receivableTrend}%</span>
            <ArrowDownRight className="h-4 w-4 ml-1" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Contas a Receber</p>
          <h3 className="text-2xl font-bold">{formatCurrency(accountsReceivable)}</h3>
        </div>
      </div>
    </div>
  );
}
