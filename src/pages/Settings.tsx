
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Scissors, 
  Users, 
  Clock, 
  Calendar, 
  DollarSign,
  Bell, 
  Link, 
  Lock, 
  Settings as SettingsIcon,
  HelpCircle,
  Save
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("business");
  
  const settingsTabs = [
    { id: "business", label: "Perfil do Negócio", icon: Building2 },
    { id: "services", label: "Serviços e Preços", icon: Scissors },
    { id: "staff", label: "Funcionários", icon: Users },
    { id: "hours", label: "Horários", icon: Clock },
    { id: "appointments", label: "Agendamentos", icon: Calendar },
    { id: "financial", label: "Financeiro", icon: DollarSign },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "integrations", label: "Integrações", icon: Link },
    { id: "permissions", label: "Permissões", icon: Lock },
    { id: "other", label: "Outras", icon: SettingsIcon },
  ];

  return (
    <div className="container mx-auto space-y-6">
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

      <Tabs defaultValue="business" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="flex justify-start w-max p-1 mb-4 border rounded-lg">
            {settingsTabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex items-center gap-2 px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Negócio</CardTitle>
              <CardDescription>
                Configure as informações básicas do seu estabelecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Estabelecimento</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="Nome do seu negócio" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CNPJ</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="00.000.000/0000-00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <input type="tel" className="w-full p-2 border rounded-md" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" className="w-full p-2 border rounded-md" placeholder="seu@email.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Endereço</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="Endereço completo" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Serviços e Preços</CardTitle>
              <CardDescription>
                Gerencie os serviços oferecidos e seus preços
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">Lista de Serviços</h3>
                  <Button variant="outline" size="sm">Adicionar Serviço</Button>
                </div>
                <div className="border rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Configure seus serviços na aba "Serviços" do menu principal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funcionários</CardTitle>
              <CardDescription>
                Gerenciamento de funcionários e colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">Equipe</h3>
                  <Button variant="outline" size="sm">Adicionar Funcionário</Button>
                </div>
                <div className="border rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Configure sua equipe na aba "Profissionais" do menu principal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Horários</CardTitle>
              <CardDescription>
                Configure horários de funcionamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Dias da Semana</h3>
                    <div className="space-y-2">
                      {["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"].map((day, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{day}</span>
                          <div className="flex items-center gap-2">
                            <select className="p-1 border rounded-md text-sm">
                              {Array.from({length: 24}, (_, i) => i).map(hour => (
                                <option key={hour} value={hour}>{`${hour.toString().padStart(2, '0')}:00`}</option>
                              ))}
                            </select>
                            <span>até</span>
                            <select className="p-1 border rounded-md text-sm">
                              {Array.from({length: 24}, (_, i) => i).map(hour => (
                                <option key={hour} value={hour}>{`${hour.toString().padStart(2, '0')}:00`}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Configurações Adicionais</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="allow-sunday" />
                        <label htmlFor="allow-sunday">Permitir agendamentos aos domingos</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="allow-holidays" />
                        <label htmlFor="allow-holidays">Permitir agendamentos em feriados</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="auto-confirm" />
                        <label htmlFor="auto-confirm">Confirmar agendamentos automaticamente</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conteúdo para as outras abas (renderização condicional) */}
        {["appointments", "financial", "notifications", "integrations", "permissions", "other"].map((tabId) => (
          <TabsContent key={tabId} value={tabId} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{settingsTabs.find(tab => tab.id === tabId)?.label}</CardTitle>
                <CardDescription>
                  Configure as opções de {settingsTabs.find(tab => tab.id === tabId)?.label.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 text-center">
                  <p className="text-muted-foreground">Conteúdo de {settingsTabs.find(tab => tab.id === tabId)?.label} em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Settings;
