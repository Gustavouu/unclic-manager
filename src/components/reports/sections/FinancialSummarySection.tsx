
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, ShoppingBag, AlertCircle } from "lucide-react";

interface FinancialSummarySectionProps {
  dateRange: string;
}

export function FinancialSummarySection({ dateRange }: FinancialSummarySectionProps) {
  // No real application, we would use the dateRange to filter data
  console.log(`Loading financial summary for range: ${dateRange}`);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-full">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div className="text-sm text-green-600 flex items-center">
            <span>+12.5%</span>
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Receita Total</p>
          <h3 className="text-2xl font-bold">R$ 26.450</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-red-100 p-2 rounded-full">
            <ShoppingBag className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-sm text-red-600 flex items-center">
            <span>+2.3%</span>
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Despesas</p>
          <h3 className="text-2xl font-bold">R$ 10.240</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-green-100 p-2 rounded-full">
            <CreditCard className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-sm text-green-600 flex items-center">
            <span>+18.2%</span>
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Lucro Líquido</p>
          <h3 className="text-2xl font-bold">R$ 16.210</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-amber-100 p-2 rounded-full">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-sm text-amber-600 flex items-center">
            <span>-5.1%</span>
            <ArrowDownRight className="h-4 w-4 ml-1" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Contas a Receber</p>
          <h3 className="text-2xl font-bold">R$ 3.850</h3>
        </div>
      </div>
    </div>
  );
}
