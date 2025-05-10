
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessProfileTab from "./tabs/BusinessProfileTab";
import { AppointmentsTab } from "./tabs/AppointmentsTab";
import { HoursTab } from "./tabs/HoursTab";
import { ServicesTab } from "./tabs/ServicesTab";
import { StaffTab } from "./tabs/StaffTab";
import { FinancialTab } from "./tabs/FinancialTab";
import NotificationsTab from "./tabs/NotificationsTab";
import { IntegrationsTab } from "./tabs/IntegrationsTab";
import { PermissionsTab } from "./tabs/PermissionsTab";
import { OtherTab } from "./tabs/OtherTab";
import { useSearchParams } from "react-router-dom";

interface SettingsTabsProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const SettingsTabs = ({ activeTab, onTabChange }: SettingsTabsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = activeTab || searchParams.get("tab") || "business-profile";

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    } else {
      setSearchParams({ tab: value });
    }
  };

  return (
    <Tabs defaultValue={initialTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 mb-8">
        <TabsTrigger value="business-profile">Perfil</TabsTrigger>
        <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
        <TabsTrigger value="hours">Horários</TabsTrigger>
        <TabsTrigger value="services">Serviços</TabsTrigger>
        <TabsTrigger value="staff">Funcionários</TabsTrigger>
        <TabsTrigger value="financial">Financeiro</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
        <TabsTrigger value="integrations">Integrações</TabsTrigger>
        <TabsTrigger value="permissions">Permissões</TabsTrigger>
        <TabsTrigger value="other">Outros</TabsTrigger>
      </TabsList>
      
      <div className="p-6">
        <TabsContent value="business-profile">
          <BusinessProfileTab />
        </TabsContent>
        <TabsContent value="appointments">
          <AppointmentsTab />
        </TabsContent>
        <TabsContent value="hours">
          <HoursTab />
        </TabsContent>
        <TabsContent value="services">
          <ServicesTab />
        </TabsContent>
        <TabsContent value="staff">
          <StaffTab />
        </TabsContent>
        <TabsContent value="financial">
          <FinancialTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="integrations">
          <IntegrationsTab />
        </TabsContent>
        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>
        <TabsContent value="other">
          <OtherTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default SettingsTabs;
