
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HelpCircle, Save, Rocket } from "lucide-react";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
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
import { mockSaveFunction, showSuccessToast, showErrorToast } from "@/utils/formUtils";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { OnboardingProvider } from "@/contexts/OnboardingContext";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("business");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    
    try {
      const success = await mockSaveFunction();
      
      if (success) {
        showSuccessToast("Todas as configurações foram salvas com sucesso!");
      } else {
        showErrorToast();
      }
    } catch (error) {
      showErrorToast();
    } finally {
      setIsSaving(false);
    }
  };

  const handleOnboarding = () => {
    navigate("/onboarding");
  };

  return (
    <OnboardingProvider>
      <div className="container mx-auto space-y-6 pb-8">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleOnboarding}>
              <Rocket className="mr-2 h-4 w-4" />
              Onboarding
            </Button>
            <Button onClick={handleGlobalSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Alterações"}
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
        
        <Toaster position="top-right" />
      </div>
    </OnboardingProvider>
  );
};

export default Settings;
