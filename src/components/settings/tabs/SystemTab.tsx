
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const SystemTab = () => {
  const [settings, setSettings] = useState({
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    currency: "BRL",
    language: "pt-BR",
    enableBackups: true,
    backupFrequency: "daily",
    enableAuditLog: true,
    sessionTimeout: 30,
    enableTwoFactor: false,
    allowDataExport: true,
    maintenanceMode: false
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success("Configurações do sistema salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Regionais</CardTitle>
          <CardDescription>
            Configure o fuso horário, idioma e formatos de data/hora
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Fuso Horário</Label>
              <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                  <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Idioma</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Formato de Data</Label>
              <Select value={settings.dateFormat} onValueChange={(value) => updateSetting("dateFormat", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Formato de Hora</Label>
              <Select value={settings.timeFormat} onValueChange={(value) => updateSetting("timeFormat", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 horas</SelectItem>
                  <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Moeda</Label>
              <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>
            Configurações de segurança e controle de acesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Autenticação de Dois Fatores</Label>
              <p className="text-sm text-gray-600">Adiciona uma camada extra de segurança</p>
            </div>
            <Switch
              checked={settings.enableTwoFactor}
              onCheckedChange={(checked) => updateSetting("enableTwoFactor", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Log de Auditoria</Label>
              <p className="text-sm text-gray-600">Registra todas as ações dos usuários</p>
            </div>
            <Switch
              checked={settings.enableAuditLog}
              onCheckedChange={(checked) => updateSetting("enableAuditLog", checked)}
            />
          </div>

          <Separator />

          <div>
            <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value))}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup e Dados</CardTitle>
          <CardDescription>
            Configurações de backup automático e exportação de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Backup Automático</Label>
              <p className="text-sm text-gray-600">Cria backups automáticos dos seus dados</p>
            </div>
            <Switch
              checked={settings.enableBackups}
              onCheckedChange={(checked) => updateSetting("enableBackups", checked)}
            />
          </div>

          {settings.enableBackups && (
            <>
              <Separator />
              <div>
                <Label>Frequência do Backup</Label>
                <Select value={settings.backupFrequency} onValueChange={(value) => updateSetting("backupFrequency", value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                    <SelectItem value="monthly">Mensalmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Permitir Exportação de Dados</Label>
              <p className="text-sm text-gray-600">Usuários podem exportar relatórios e dados</p>
            </div>
            <Switch
              checked={settings.allowDataExport}
              onCheckedChange={(checked) => updateSetting("allowDataExport", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manutenção</CardTitle>
          <CardDescription>
            Configurações de manutenção do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Modo de Manutenção</Label>
              <p className="text-sm text-gray-600">Bloqueia o acesso ao sistema para manutenção</p>
            </div>
            <div className="flex items-center gap-2">
              {settings.maintenanceMode && <Badge variant="destructive">Ativo</Badge>}
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
              />
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button variant="outline">
              Limpar Cache
            </Button>
            <Button variant="outline">
              Verificar Integridade
            </Button>
            <Button variant="outline">
              Otimizar Banco
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};
