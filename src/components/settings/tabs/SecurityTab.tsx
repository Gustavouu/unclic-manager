
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Key, Eye } from "lucide-react";
import { toast } from "sonner";

export const SecurityTab = () => {
  const [settings, setSettings] = useState({
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiration: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    enableIpWhitelist: false,
    enableSessionLogging: true,
    enableEmailAlerts: true,
    enableSmsAlerts: false,
    forcePasswordChange: false,
    allowRememberMe: true,
    sessionDuration: 8
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success("Configurações de segurança salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Configurações de segurança são críticas. Teste cuidadosamente antes de aplicar em produção.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Políticas de Senha
          </CardTitle>
          <CardDescription>
            Configure os requisitos de segurança para senhas de usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passwordMinLength">Tamanho Mínimo</Label>
              <Input
                id="passwordMinLength"
                type="number"
                min="6"
                max="32"
                value={settings.passwordMinLength}
                onChange={(e) => updateSetting("passwordMinLength", parseInt(e.target.value))}
                className="w-24"
              />
            </div>

            <div>
              <Label htmlFor="passwordExpiration">Expiração (dias)</Label>
              <Input
                id="passwordExpiration"
                type="number"
                min="0"
                max="365"
                value={settings.passwordExpiration}
                onChange={(e) => updateSetting("passwordExpiration", parseInt(e.target.value))}
                className="w-24"
              />
              <p className="text-xs text-gray-500 mt-1">0 = nunca expira</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Exigir letras maiúsculas</Label>
              <Switch
                checked={settings.requireUppercase}
                onCheckedChange={(checked) => updateSetting("requireUppercase", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Exigir números</Label>
              <Switch
                checked={settings.requireNumbers}
                onCheckedChange={(checked) => updateSetting("requireNumbers", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Exigir caracteres especiais</Label>
              <Switch
                checked={settings.requireSpecialChars}
                onCheckedChange={(checked) => updateSetting("requireSpecialChars", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Forçar troca na primeira entrada</Label>
              <Switch
                checked={settings.forcePasswordChange}
                onCheckedChange={(checked) => updateSetting("forcePasswordChange", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controle de Acesso</CardTitle>
          <CardDescription>
            Configure as políticas de autenticação e sessão
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxLoginAttempts">Máx. Tentativas de Login</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                min="3"
                max="20"
                value={settings.maxLoginAttempts}
                onChange={(e) => updateSetting("maxLoginAttempts", parseInt(e.target.value))}
                className="w-24"
              />
            </div>

            <div>
              <Label htmlFor="lockoutDuration">Bloqueio (minutos)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                min="5"
                max="1440"
                value={settings.lockoutDuration}
                onChange={(e) => updateSetting("lockoutDuration", parseInt(e.target.value))}
                className="w-24"
              />
            </div>

            <div>
              <Label htmlFor="sessionDuration">Duração da Sessão (horas)</Label>
              <Input
                id="sessionDuration"
                type="number"
                min="1"
                max="24"
                value={settings.sessionDuration}
                onChange={(e) => updateSetting("sessionDuration", parseInt(e.target.value))}
                className="w-24"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Permitir "Lembrar-me"</Label>
                <p className="text-sm text-gray-600">Usuários podem permanecer logados</p>
              </div>
              <Switch
                checked={settings.allowRememberMe}
                onCheckedChange={(checked) => updateSetting("allowRememberMe", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Lista de IPs Permitidos</Label>
                <p className="text-sm text-gray-600">Restringe acesso a IPs específicos</p>
              </div>
              <Switch
                checked={settings.enableIpWhitelist}
                onCheckedChange={(checked) => updateSetting("enableIpWhitelist", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Monitoramento e Alertas
          </CardTitle>
          <CardDescription>
            Configure o monitoramento de atividades suspeitas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Log de Sessões</Label>
                <p className="text-sm text-gray-600">Registra todas as atividades de login</p>
              </div>
              <Switch
                checked={settings.enableSessionLogging}
                onCheckedChange={(checked) => updateSetting("enableSessionLogging", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Alertas por Email</Label>
                <p className="text-sm text-gray-600">Envia alertas de segurança por email</p>
              </div>
              <Switch
                checked={settings.enableEmailAlerts}
                onCheckedChange={(checked) => updateSetting("enableEmailAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Alertas por SMS</Label>
                <p className="text-sm text-gray-600">Envia alertas críticos por SMS</p>
              </div>
              <Switch
                checked={settings.enableSmsAlerts}
                onCheckedChange={(checked) => updateSetting("enableSmsAlerts", checked)}
              />
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Eventos Monitorados</h4>
            <div className="space-y-2">
              <Badge variant="outline">Login de IP não reconhecido</Badge>
              <Badge variant="outline">Múltiplas tentativas de login</Badge>
              <Badge variant="outline">Acesso fora do horário</Badge>
              <Badge variant="outline">Mudanças em configurações críticas</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auditoria de Segurança</CardTitle>
          <CardDescription>
            Ferramentas de análise e relatórios de segurança
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button variant="outline">
              Gerar Relatório de Acessos
            </Button>
            <Button variant="outline">
              Verificar Vulnerabilidades
            </Button>
            <Button variant="outline">
              Exportar Logs de Segurança
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Última verificação:</strong> 15/12/2024 às 14:30 - Nenhuma vulnerabilidade encontrada
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Salvar Configurações de Segurança
        </Button>
      </div>
    </div>
  );
};
