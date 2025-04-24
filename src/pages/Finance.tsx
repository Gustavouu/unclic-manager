
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

import { 
  FinancialChart, 
  FinancialSummary, 
  TransactionsTable,
  TransactionFilters,
  PaymentMethodsStats,
  FinancialActions 
} from "@/components/finance";

export default function Finance() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todas");
  const [period, setPeriod] = useState("30days");
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);
  const { businessId } = useCurrentBusiness();
  
  useEffect(() => {
    // Simular o carregamento dos dados
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSearchDate(date);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Financeiro</h1>
          <p className="text-sm text-muted-foreground">
            Gerenciamento de transações e análises financeiras
          </p>
        </div>
        <FinancialActions />
      </div>
      
      <FinancialSummary isLoading={isLoading} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border shadow-sm">
          <CardHeader className="pb-3 border-b bg-white">
            <CardTitle className="text-lg">Movimentação Financeira</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <FinancialChart businessId={businessId} />
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="pb-3 border-b bg-white">
            <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <PaymentMethodsStats isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
      
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b bg-white">
          <CardTitle className="text-lg">Transações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="todas" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-3 border-b bg-white gap-4">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="todas" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Todas</TabsTrigger>
                <TabsTrigger value="receitas" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Receitas</TabsTrigger>
                <TabsTrigger value="despesas" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Despesas</TabsTrigger>
              </TabsList>
              
              <TransactionFilters 
                onPeriodChange={handlePeriodChange}
                onDateChange={handleDateChange}
              />
            </div>
            
            <TabsContent value="todas" className="mt-0">
              <TransactionsTable
                isLoading={isLoading}
                filterType="all"
                period={period}
                searchDate={searchDate}
              />
            </TabsContent>
            
            <TabsContent value="receitas" className="mt-0">
              <TransactionsTable
                isLoading={isLoading}
                filterType="receita"
                period={period}
                searchDate={searchDate}
              />
            </TabsContent>
            
            <TabsContent value="despesas" className="mt-0">
              <TransactionsTable
                isLoading={isLoading}
                filterType="despesa"
                period={period}
                searchDate={searchDate}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
