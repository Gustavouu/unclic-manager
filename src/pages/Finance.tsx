import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">
            Gerenciamento de transações e análises financeiras
          </p>
        </div>
        <FinancialActions />
      </div>
      
      <Separator className="my-6" />
      
      <FinancialSummary isLoading={isLoading} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Movimentação Financeira</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialChart businessId={businessId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodsStats isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="todas" className="mt-8" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="receitas">Receitas</TabsTrigger>
            <TabsTrigger value="despesas">Despesas</TabsTrigger>
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
    </div>
  );
}
