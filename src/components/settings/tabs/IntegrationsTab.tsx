import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Globe, Server, Webhook, ExternalLink, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const IntegrationsTab = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrações</CardTitle>
        <CardDescription>
          Conecte-se com serviços externos e APIs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Redes Sociais</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Facebook</p>
                    <span className="text-sm text-muted-foreground">Publique agendamentos e promoções</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Conectar</Button>
                  <Switch />
                </div>
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-pink-500" />
                  <div>
                    <p className="font-medium">Instagram</p>
                    <span className="text-sm text-muted-foreground">Compartilhe fotos e histórias</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Conectar</Button>
                  <Switch />
                </div>
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <span className="text-sm text-muted-foreground">Envie mensagens automáticas</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Conectar</Button>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Marketing e Vendas</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Mailchimp</p>
                    <span className="text-sm text-muted-foreground">Email marketing</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Conectar</Button>
                  <Switch />
                </div>
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Google Analytics</p>
                    <span className="text-sm text-muted-foreground">Métricas de uso</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Conectar</Button>
                  <Switch />
                </div>
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">Google Calendar</p>
                    <span className="text-sm text-muted-foreground">Sincronize agendamentos</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Conectar</Button>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pagamentos e Integrações</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between border p-3 rounded-md">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="font-medium">Efi Bank</p>
                  <span className="text-sm text-muted-foreground">Processe pagamentos online</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/payments')}>
                Configurar
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between border p-3 rounded-md">
              <div className="flex items-center gap-3">
                <Webhook className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Webhooks</p>
                  <span className="text-sm text-muted-foreground">Configurar integrações com outros sistemas</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/payments?tab=webhooks')}>
                Configurar
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">APIs e Webhooks</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between border p-3 rounded-md">
              <div className="flex items-center gap-3">
                <Webhook className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Webhooks</p>
                  <span className="text-sm text-muted-foreground">Configurar notificações em tempo real</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/payments?tab=webhooks')}>
                Configurar
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between border p-3 rounded-md">
              <div className="flex items-center gap-3">
                <Webhook className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="font-medium">Chaves de API</p>
                  <span className="text-sm text-muted-foreground">Gerenciar acessos de API</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Gerenciar
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Alterações</Button>
      </CardFooter>
    </Card>
  );
};
