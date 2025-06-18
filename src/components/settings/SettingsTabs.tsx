
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
import { SystemTab } from "./tabs/SystemTab";
import { SecurityTab } from "./tabs/SecurityTab";
import { BackupTab } from "./tabs/BackupTab";
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
      <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-13 mb-8 h-auto p-1">
        <TabsTrigger value="business-profile" className="text-xs">Perfil</TabsTrigger>
        <TabsTrigger value="appointments" className="text-xs">Agendamentos</TabsTrigger>
        <TabsTrigger value="hours" className="text-xs">Horários</TabsTrigger>
        <TabsTrigger value="services" className="text-xs">Serviços</TabsTrigger>
        <TabsTrigger value="staff" className="text-xs">Funcionários</TabsTrigger>
        <TabsTrigger value="financial" className="text-xs">Financeiro</TabsTrigger>
        <TabsTrigger value="notifications" className="text-xs">Notificações</TabsTrigger>
        <TabsTrigger value="integrations" className="text-xs">Integrações</TabsTrigger>
        <TabsTrigger value="permissions" className="text-xs">Permissões</TabsTrigger>
        <TabsTrigger value="security" className="text-xs">Segurança</TabsTrigger>
        <TabsTrigger value="backup" className="text-xs">Backup</TabsTrigger>
        <TabsTrigger value="system" className="text-xs">Sistema</TabsTrigger>
        <TabsTrigger value="other" className="text-xs">Outros</TabsTrigger>
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
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="backup">
          <BackupTab />
        </TabsContent>
        <TabsContent value="system">
          <SystemTab />
        </TabsContent>
        <TabsContent value="other">
          <OtherTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default SettingsTabs;
