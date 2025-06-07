
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Monitor, Bell, Shield, Database } from 'lucide-react';
import { MonitoringDashboard } from '@/components/monitoring/MonitoringDashboard';
import { ErrorNotificationCenter } from '@/components/monitoring/ErrorNotificationCenter';
import { useErrorHandling } from '@/contexts/ErrorHandlingContext';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const { isInitialized, errorCount, alertCount } = useErrorHandling();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema e monitoramento
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Sistema:</span>
            <Badge variant={isInitialized ? "default" : "secondary"}>
              {isInitialized ? "Operacional" : "Inicializando"}
            </Badge>
          </div>
          <ErrorNotificationCenter />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Monitoramento
            {(errorCount > 0 || alertCount > 0) && (
              <Badge variant="destructive" className="ml-1">
                {errorCount + alertCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure as preferências básicas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Modo de Produção</h4>
                    <p className="text-sm text-muted-foreground">
                      Sistema configurado para ambiente de produção
                    </p>
                  </div>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Error Handling</h4>
                    <p className="text-sm text-muted-foreground">
                      Sistema de captura e tratamento de erros
                    </p>
                  </div>
                  <Badge variant={isInitialized ? "default" : "secondary"}>
                    {isInitialized ? "Configurado" : "Configurando..."}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <MonitoringDashboard />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
              <CardDescription>
                Configure quando e como receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas Críticos</h4>
                    <p className="text-sm text-muted-foreground">
                      Notificações para erros críticos do sistema
                    </p>
                  </div>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Relatórios Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      Alertas quando a performance está degradada
                    </p>
                  </div>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Segurança</h4>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre atividades suspeitas
                    </p>
                  </div>
                  <Badge variant="default">Ativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Configure as políticas de segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Monitoramento de Segurança</h4>
                    <p className="text-sm text-muted-foreground">
                      Detecta atividades suspeitas e tentativas de acesso não autorizado
                    </p>
                  </div>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Logs de Auditoria</h4>
                    <p className="text-sm text-muted-foreground">
                      Registra todas as ações críticas do sistema
                    </p>
                  </div>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Validação de Dados</h4>
                    <p className="text-sm text-muted-foreground">
                      Valida e sanitiza todos os dados de entrada
                    </p>
                  </div>
                  <Badge variant="default">Ativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
