
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HelpCircle, Save } from "lucide-react";
import { SettingsTabs, settingsTabs } from "@/components/settings/SettingsTabs";
import { BusinessProfileTab } from "@/components/settings/tabs/BusinessProfileTab";
import { HoursTab } from "@/components/settings/tabs/HoursTab";
import { ServicesTab } from "@/components/settings/tabs/ServicesTab";
import { StaffTab } from "@/components/settings/tabs/StaffTab";
import { AppointmentsTab } from "@/components/settings/tabs/AppointmentsTab";
import { FinancialTab } from "@/components/settings/tabs/FinancialTab";
import { NotificationsTab } from "@/components/settings/tabs/NotificationsTab";
import { IntegrationsTab } from "@/components/settings/tabs/IntegrationsTab";
import { PermissionsTab } from "@/components/settings/tabs/PermissionsTab";
import { OtherTab } from "@/components/settings/tabs/OtherTab";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("business");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <HelpCircle className="mr-2 h-4 w-4" />
            Tutorial de Configuração
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="business" value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <TabsContent value="business">
          <BusinessProfileTab />
        </TabsContent>

        <TabsContent value="services">
          <ServicesTab />
        </TabsContent>

        <TabsContent value="staff">
          <StaffTab />
        </TabsContent>

        <TabsContent value="hours">
          <HoursTab />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsTab />
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
      </Tabs>
    </div>
  );
};

export default Settings;
