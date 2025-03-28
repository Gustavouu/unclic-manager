
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialReports } from "./tabs/FinancialReports";
import { ClientReports } from "./tabs/ClientReports";
import { ServiceReports } from "./tabs/ServiceReports";
import { ProfessionalsReports } from "./tabs/ProfessionalsReports";
import { ReportStatistics } from "@/hooks/reports/useReportsData";

interface ReportsTabsProps {
  dateRange: string;
  stats: ReportStatistics;
}

export function ReportsTabs({ dateRange, stats }: ReportsTabsProps) {
  const [activeTab, setActiveTab] = useState("financial");

  return (
    <Tabs defaultValue="financial" onValueChange={setActiveTab} value={activeTab} className="space-y-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
        <TabsTrigger value="financial">Financeiro</TabsTrigger>
        <TabsTrigger value="clients">Clientes</TabsTrigger>
        <TabsTrigger value="services">Serviços</TabsTrigger>
        <TabsTrigger value="professionals">Profissionais</TabsTrigger>
      </TabsList>
      <TabsContent value="financial" className="space-y-4 pt-2">
        <FinancialReports dateRange={dateRange} stats={stats} />
      </TabsContent>
      <TabsContent value="clients" className="space-y-4 pt-2">
        <ClientReports dateRange={dateRange} stats={stats} />
      </TabsContent>
      <TabsContent value="services" className="space-y-4 pt-2">
        <ServiceReports dateRange={dateRange} stats={stats} />
      </TabsContent>
      <TabsContent value="professionals" className="space-y-4 pt-2">
        <ProfessionalsReports dateRange={dateRange} stats={stats} />
      </TabsContent>
    </Tabs>
  );
}
