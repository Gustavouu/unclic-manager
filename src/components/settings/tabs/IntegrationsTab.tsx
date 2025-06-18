
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, Settings, Calendar, CreditCard, BarChart3, Users, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  isConnected: boolean;
  isActive: boolean;
  lastSync?: string;
  settings?: Record<string, any>;
}

export const IntegrationsTab = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Sincronize agendamentos com Google Calendar",
      category: "Calendário",
      icon: <Calendar className="h-6 w-6" />,
      isConnected: false,
      isActive: false
    },
    {
      id: "whatsapp-business",
      name: "WhatsApp Business",
      description: "Envie notificações via WhatsApp",
      category: "Comunicação",
      icon: <MessageSquare className="h-6 w-6" />,
      isConnected: false,
      isActive: false
    },
    {
      id: "mercado-pago",
      name: "Mercado Pago",
      description: "Processe pagamentos online",
      category: "Pagamentos",
      icon: <CreditCard className="h-6 w-6" />,
      isConnected: false,
      isActive: false
    },
    {
      id: "pix",
      name: "PIX",
      description: "Aceite pagamentos via PIX",
      category: "Pagamentos",
      icon: <CreditCard className="h-6 w-6" />,
      isConnected: true,
      isActive: true,
      lastSync: "2024-01-15T10:30:00Z"
    },
    {
      id: "google-analytics",
      name: "Google Analytics",
      description: "Analise o comportamento dos clientes",
      category: "Analytics",
      icon: <BarChart3 className="h-6 w-6" />,
      isConnected: false,
      isActive: false
    },
    {
      id: "facebook-meta",
      name: "Facebook/Meta",
      description: "Sincronize com Facebook e Instagram",
      category: "Marketing",
      icon: <Users className="h-6 w-6" />,
      isConnected: false,
      isActive: false
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Gerencie campanhas de email marketing",
      category: "Marketing",
      icon: <MessageSquare className="h-6 w-6" />,
      isConnected: false,
      isActive: false
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, isActive: !integration.isActive }
        : integration
    ));
    toast.success("Status da integração atualizado");
  };

  const connectIntegration = (id: string) => {
    // Simular processo de conexão
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            isConnected: true, 
            isActive: true,
            lastSync: new Date().toISOString()
          }
        : integration
    ));
    toast.success("Integração conectada com sucesso!");
  };

  const disconnectIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            isConnected: false, 
            isActive: false,
            lastSync: undefined
          }
        : integration
    ));
    toast.success("Integração desconectada");
  };

  const categories = ["Todos", "Calendário", "Comunicação", "Pagamentos", "Analytics", "Marketing"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredIntegrations = selectedCategory === "Todos" 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory);

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return "Nunca";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR") + " às " + date.toLocaleTimeString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Integrações Disponíveis
          </CardTitle>
          <CardDescription>
            Conecte seu negócio com ferramentas externas para ampliar funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIntegrations.map((integration) => (
              <div key={integration.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 border rounded-lg">
                      {integration.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{integration.name}</h3>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {integration.isConnected ? (
                      <Badge variant="default">Conectado</Badge>
                    ) : (
                      <Badge variant="secondary">Desconectado</Badge>
                    )}
                    <Badge variant="outline">{integration.category}</Badge>
                  </div>
                </div>

                {integration.isConnected && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ativa</span>
                      <Switch
                        checked={integration.isActive}
                        onCheckedChange={() => toggleIntegration(integration.id)}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Última sincronização: {formatLastSync(integration.lastSync)}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {integration.isConnected ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIntegration(integration)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Configurar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => disconnectIntegration(integration.id)}
                      >
                        Desconectar
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => connectIntegration(integration.id)}
                    >
                      Conectar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Painel de configuração da integração selecionada */}
      {selectedIntegration && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedIntegration.icon}
              Configurações - {selectedIntegration.name}
            </CardTitle>
            <CardDescription>
              Configure os parâmetros da integração
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedIntegration.id === "google-calendar" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="calendar-id">ID do Calendário</Label>
                  <Input
                    id="calendar-id"
                    placeholder="primary"
                    defaultValue="primary"
                  />
                </div>
                <div>
                  <Label>Sincronização bidirecional</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Switch defaultChecked />
                    <span className="text-sm text-gray-600">
                      Agendamentos criados no Google Calendar serão importados
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedIntegration.id === "whatsapp-business" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="whatsapp-number">Número do WhatsApp Business</Label>
                  <Input
                    id="whatsapp-number"
                    placeholder="+55 11 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="api-token">Token da API</Label>
                  <Input
                    id="api-token"
                    type="password"
                    placeholder="Insira o token da API"
                  />
                </div>
              </div>
            )}

            {selectedIntegration.id === "mercado-pago" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="public-key">Chave Pública</Label>
                  <Input
                    id="public-key"
                    placeholder="APP_USR-..."
                  />
                </div>
                <div>
                  <Label htmlFor="access-token">Access Token</Label>
                  <Input
                    id="access-token"
                    type="password"
                    placeholder="APP_USR-..."
                  />
                </div>
                <div>
                  <Label>Ambiente</Label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="environment" value="sandbox" defaultChecked />
                      <span className="text-sm">Sandbox (testes)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="environment" value="production" />
                      <span className="text-sm">Produção</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex gap-2">
              <Button>Salvar Configurações</Button>
              <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>
            Configure URLs para receber notificações de eventos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input
              id="webhook-url"
              placeholder="https://seusite.com/webhook"
            />
          </div>

          <div>
            <Label>Eventos</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="appointment-created" defaultChecked />
                <Label htmlFor="appointment-created" className="text-sm">
                  Agendamento criado
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="appointment-cancelled" defaultChecked />
                <Label htmlFor="appointment-cancelled" className="text-sm">
                  Agendamento cancelado
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="payment-received" />
                <Label htmlFor="payment-received" className="text-sm">
                  Pagamento recebido
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="client-created" />
                <Label htmlFor="client-created" className="text-sm">
                  Cliente criado
                </Label>
              </div>
            </div>
          </div>

          <Button>Salvar Webhook</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Gerencie as chaves de API para integrações personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Chave de API Principal</h4>
                <p className="text-sm text-gray-600">Use esta chave para acessar a API</p>
              </div>
              <div className="text-right">
                <code className="text-sm bg-white px-2 py-1 rounded border">
                  sk_live_************************
                </code>
                <p className="text-xs text-gray-500 mt-1">Última utilização: hoje</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">Gerar Nova Chave</Button>
            <Button variant="outline">Ver Documentação da API</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
