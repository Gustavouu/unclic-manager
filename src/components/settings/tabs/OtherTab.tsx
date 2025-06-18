
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, Upload, Trash2, RefreshCw, Database, FileText, Settings, Zap } from "lucide-react";
import { toast } from "sonner";

export const OtherTab = () => {
  const [settings, setSettings] = useState({
    enableDebugMode: false,
    enableAnalytics: true,
    enablePerformanceMonitoring: true,
    enableAutomaticUpdates: true,
    maintenanceMode: false,
    defaultLanguage: "pt-BR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    enableDataExport: true,
    enableDataImport: false,
    enableCustomCss: false,
    customCss: "",
    enableWebhooks: false,
    webhookUrl: "",
    enableApiAccess: false,
    apiRateLimit: 1000,
    storageLimit: 1000, // MB
    currentStorage: 245 // MB
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = () => {
    toast.success("Exportação de dados iniciada. Você receberá um email quando estiver pronta.");
  };

  const handleImportData = () => {
    toast.success("Arquivo de importação processado com sucesso!");
  };

  const handleClearCache = () => {
    toast.success("Cache limpo com sucesso!");
  };

  const handleOptimizeDatabase = () => {
    toast.success("Otimização do banco de dados iniciada!");
  };

  const handleResetSettings = () => {
    if (confirm("Tem certeza que deseja redefinir todas as configurações? Esta ação não pode ser desfeita.")) {
      toast.success("Configurações redefinidas para os valores padrão");
    }
  };

  const handleSave = () => {
    toast.success("Configurações gerais salvas com sucesso!");
  };

  const storagePercentage = (settings.currentStorage / settings.storageLimit) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>
            Configurações diversas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Idioma padrão</Label>
              <Select value={settings.defaultLanguage} onValueChange={(value) => updateSetting("defaultLanguage", value)}>
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

            <div>
              <Label>Formato de data</Label>
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
              <Label>Formato de hora</Label>
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
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Analytics e relatórios</Label>
                <p className="text-sm text-gray-600">Coletar dados para relatórios</p>
              </div>
              <Switch
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => updateSetting("enableAnalytics", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Monitoramento de performance</Label>
                <p className="text-sm text-gray-600">Monitorar desempenho do sistema</p>
              </div>
              <Switch
                checked={settings.enablePerformanceMonitoring}
                onCheckedChange={(checked) => updateSetting("enablePerformanceMonitoring", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Atualizações automáticas</Label>
                <p className="text-sm text-gray-600">Instalar atualizações automaticamente</p>
              </div>
              <Switch
                checked={settings.enableAutomaticUpdates}
                onCheckedChange={(checked) => updateSetting("enableAutomaticUpdates", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Importação e Exportação
          </CardTitle>
          <CardDescription>
            Gerencie a importação e exportação de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Permitir exportação de dados</Label>
              <p className="text-sm text-gray-600">Usuários podem exportar relatórios</p>
            </div>
            <Switch
              checked={settings.enableDataExport}
              onCheckedChange={(checked) => updateSetting("enableDataExport", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Permitir importação de dados</Label>
              <p className="text-sm text-gray-600">Usuários podem importar dados</p>
            </div>
            <Switch
              checked={settings.enableDataImport}
              onCheckedChange={(checked) => updateSetting("enableDataImport", checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Ações de dados</h4>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Todos os Dados
              </Button>
              {settings.enableDataImport && (
                <Button variant="outline" onClick={handleImportData}>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Dados
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalização</CardTitle>
          <CardDescription>
            Personalize a aparência e comportamento do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>CSS personalizado</Label>
              <p className="text-sm text-gray-600">Permitir CSS customizado</p>
            </div>
            <Switch
              checked={settings.enableCustomCss}
              onCheckedChange={(checked) => updateSetting("enableCustomCss", checked)}
            />
          </div>

          {settings.enableCustomCss && (
            <div>
              <Label htmlFor="customCss">Código CSS</Label>
              <Textarea
                id="customCss"
                value={settings.customCss}
                onChange={(e) => updateSetting("customCss", e.target.value)}
                placeholder="/* Insira seu CSS personalizado aqui */"
                className="font-mono"
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Cuidado: CSS personalizado pode afetar a funcionalidade do sistema
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            API e Webhooks
          </CardTitle>
          <CardDescription>
            Configure acesso à API e webhooks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Acesso à API</Label>
              <p className="text-sm text-gray-600">Permitir acesso via API REST</p>
            </div>
            <Switch
              checked={settings.enableApiAccess}
              onCheckedChange={(checked) => updateSetting("enableApiAccess", checked)}
            />
          </div>

          {settings.enableApiAccess && (
            <div>
              <Label htmlFor="apiRateLimit">Limite de requisições por hora</Label>
              <Input
                id="apiRateLimit"
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => updateSetting("apiRateLimit", parseInt(e.target.value))}
                className="w-32"
              />
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Webhooks</Label>
              <p className="text-sm text-gray-600">Notificações automáticas via webhook</p>
            </div>
            <Switch
              checked={settings.enableWebhooks}
              onCheckedChange={(checked) => updateSetting("enableWebhooks", checked)}
            />
          </div>

          {settings.enableWebhooks && (
            <div>
              <Label htmlFor="webhookUrl">URL do Webhook</Label>
              <Input
                id="webhookUrl"
                value={settings.webhookUrl}
                onChange={(e) => updateSetting("webhookUrl", e.target.value)}
                placeholder="https://seusite.com/webhook"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Armazenamento</CardTitle>
          <CardDescription>
            Monitore o uso de armazenamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Armazenamento usado</span>
              <span>{settings.currentStorage} MB de {settings.storageLimit} MB</span>
            </div>
            <Progress value={storagePercentage} className="w-full" />
            {storagePercentage > 80 && (
              <p className="text-sm text-orange-600 mt-1">
                Atenção: Você está usando {storagePercentage.toFixed(1)}% do armazenamento
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-gray-600">Imagens</p>
              <p className="text-xl font-semibold">120 MB</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-gray-600">Banco de dados</p>
              <p className="text-xl font-semibold">125 MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Manutenção do Sistema
          </CardTitle>
          <CardDescription>
            Ferramentas de manutenção e otimização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Modo manutenção</Label>
              <p className="text-sm text-gray-600">Bloquear acesso para manutenção</p>
            </div>
            <div className="flex items-center gap-2">
              {settings.maintenanceMode && <Badge variant="destructive">Ativo</Badge>}
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Modo debug</Label>
              <p className="text-sm text-gray-600">Ativar logs detalhados</p>
            </div>
            <Switch
              checked={settings.enableDebugMode}
              onCheckedChange={(checked) => updateSetting("enableDebugMode", checked)}
            />
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Ferramentas de manutenção</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button variant="outline" onClick={handleClearCache}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpar Cache
              </Button>
              <Button variant="outline" onClick={handleOptimizeDatabase}>
                <Database className="h-4 w-4 mr-2" />
                Otimizar BD
              </Button>
              <Button variant="destructive" onClick={handleResetSettings}>
                <Trash2 className="h-4 w-4 mr-2" />
                Redefinir
              </Button>
            </div>
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
