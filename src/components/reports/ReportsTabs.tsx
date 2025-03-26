
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialReports } from "./tabs/FinancialReports";
import { ClientReports } from "./tabs/ClientReports";
import { ServiceReports } from "./tabs/ServiceReports";
import { ProfessionalsReports } from "./tabs/ProfessionalsReports";

export function ReportsTabs() {
  const [activeTab, setActiveTab] = useState("financial");

  return (
    <Tabs defaultValue="financial" onValueChange={setActiveTab} value={activeTab} className="space-y-4">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
        <TabsTrigger value="financial">Financeiro</TabsTrigger>
        <TabsTrigger value="clients">Clientes</TabsTrigger>
        <TabsTrigger value="services">Serviços</TabsTrigger>
        <TabsTrigger value="professionals">Profissionais</TabsTrigger>
      </TabsList>
      <TabsContent value="financial" className="space-y-4">
        <FinancialReports />
      </TabsContent>
      <TabsContent value="clients" className="space-y-4">
        <ClientReports />
      </TabsContent>
      <TabsContent value="services" className="space-y-4">
        <ServiceReports />
      </TabsContent>
      <TabsContent value="professionals" className="space-y-4">
        <ProfessionalsReports />
      </TabsContent>
    </Tabs>
  );
}
