
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
  HelpCircle
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
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 border-t border-b py-4">
          {settingsTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className="flex items-center gap-2 px-3 py-2"
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {activeTab === "business" && (
            <Card>
              <CardHeader>
                <CardTitle>Perfil do Negócio</CardTitle>
                <CardDescription>
                  Configure as informações básicas do seu estabelecimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo do Perfil do Negócio</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "services" && (
            <Card>
              <CardHeader>
                <CardTitle>Serviços e Preços</CardTitle>
                <CardDescription>
                  Gerencie os serviços oferecidos e seus preços
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de Serviços e Preços</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "staff" && (
            <Card>
              <CardHeader>
                <CardTitle>Funcionários</CardTitle>
                <CardDescription>
                  Gerenciamento de funcionários e colaboradores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de Funcionários</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "hours" && (
            <Card>
              <CardHeader>
                <CardTitle>Horários</CardTitle>
                <CardDescription>
                  Configure horários de funcionamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de Horários</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "appointments" && (
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos</CardTitle>
                <CardDescription>
                  Configure as opções de agendamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de Agendamentos</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "financial" && (
            <Card>
              <CardHeader>
                <CardTitle>Financeiro</CardTitle>
                <CardDescription>
                  Configure opções financeiras e pagamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de Financeiro</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Configure alertas e notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de Notificações</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>
                  Configure integrações com outros serviços
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de Integrações</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "permissions" && (
            <Card>
              <CardHeader>
                <CardTitle>Permissões</CardTitle>
                <CardDescription>
                  Configure permissões e acessos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de Permissões</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "other" && (
            <Card>
              <CardHeader>
                <CardTitle>Outras Configurações</CardTitle>
                <CardDescription>
                  Configurações adicionais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de Outras Configurações</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
