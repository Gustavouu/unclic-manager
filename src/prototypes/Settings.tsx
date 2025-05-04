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
import { OnboardingProvider } from "@/contexts/onboarding/OnboardingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from 'react';
import { Input } from './components/Input';
import { Label } from './components/Label';
import { Checkbox } from './components/Checkbox';
import { Textarea } from './components/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/Select';
import { Switch } from './components/Switch';
import { Slider } from './components/Slider';
import { Calendar } from './components/Calendar';
import { CalendarIcon, CheckCheck, ChevronsUpDown, Facebook, Instagram } from 'lucide-react';
import { PopoverClose } from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Configurações</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie as configurações do seu negócio
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 h-9">
                  <HelpCircle className="h-4 w-4" />
                  Ajuda
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" side="left">
                <div className="space-y-2">
                  <h3 className="font-medium">Configurações do Negócio</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure todos os aspectos do seu negócio, como perfil da empresa, horários de funcionamento, serviços e colaboradores.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" onClick={handleOnboarding}>
              <Rocket className="mr-2 h-4 w-4" />
              Onboarding
            </Button>
            
            <Button onClick={handleGlobalSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>

        <Card className="border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Tabs defaultValue="business" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />

              <div className="p-6">
                <TabsContent value="business">
                  <form className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="businessName">Nome do Negócio</Label>
                        <Input type="text" id="businessName" placeholder="Nome Fantasia" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="Email de Contato" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input type="tel" id="phone" placeholder="(XX) XXXX-XXXX" />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input type="url" id="website" placeholder="https://seunegocio.com.br" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea id="description" placeholder="Descreva seu negócio" />
                    </div>
                    
                    <div>
                      <Label>Redes Sociais</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Facebook size={16} className="text-gray-400" />
                          </div>
                          <Input 
                            type="text"
                            id="facebook"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                            placeholder="https://facebook.com/seunegocio"
                          />
                        </div>
                        
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Instagram size={16} className="text-gray-400" />
                          </div>
                          <input 
                            type="text"
                            id="instagram"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                            placeholder="@seuinstagram"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Preferências</Label>
                      <div className="flex items-center space-x-4">
                        <Switch id="newsletter" />
                        <Label htmlFor="newsletter">Assinar Newsletter</Label>
                      </div>
                    </div>
                  </form>
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
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        <Toaster position="top-right" />
      </div>
    </OnboardingProvider>
  );
};

export default Settings;
