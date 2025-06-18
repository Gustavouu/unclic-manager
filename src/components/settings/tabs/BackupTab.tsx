
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, Download, Upload, HardDrive, Shield } from "lucide-react";
import { toast } from "sonner";

export const BackupTab = () => {
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    backupTime: "02:00",
    retentionDays: 30,
    includeFiles: true,
    includeDatabase: true,
    includeSettings: true,
    compression: true,
    encryption: true,
    cloudStorage: "local"
  });

  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleManualBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          toast.success("Backup criado com sucesso!");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRestore = () => {
    toast.info("Funcionalidade de restauração em desenvolvimento");
  };

  const handleSave = () => {
    toast.success("Configurações de backup salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Backups regulares são essenciais para proteger seus dados. Configure backups automáticos para maior segurança.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Backup Automático
          </CardTitle>
          <CardDescription>
            Configure backups automáticos regulares dos seus dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Habilitar Backup Automático</Label>
              <p className="text-sm text-gray-600">Cria backups automaticamente conforme configurado</p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
            />
          </div>

          {settings.autoBackup && (
            <>
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Frequência</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => updateSetting("backupFrequency", value)}>
                    <SelectTrigger>
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

                <div>
                  <Label htmlFor="backupTime">Horário</Label>
                  <Input
                    id="backupTime"
                    type="time"
                    value={settings.backupTime}
                    onChange={(e) => updateSetting("backupTime", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="retentionDays">Retenção (dias)</Label>
                  <Input
                    id="retentionDays"
                    type="number"
                    min="1"
                    max="365"
                    value={settings.retentionDays}
                    onChange={(e) => updateSetting("retentionDays", parseInt(e.target.value))}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conteúdo do Backup</CardTitle>
          <CardDescription>
            Selecione quais dados incluir nos backups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Banco de Dados</Label>
                <p className="text-sm text-gray-600">Clientes, agendamentos, serviços, etc.</p>
              </div>
              <Switch
                checked={settings.includeDatabase}
                onCheckedChange={(checked) => updateSetting("includeDatabase", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Arquivos e Imagens</Label>
                <p className="text-sm text-gray-600">Logos, fotos, documentos</p>
              </div>
              <Switch
                checked={settings.includeFiles}
                onCheckedChange={(checked) => updateSetting("includeFiles", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Configurações do Sistema</Label>
                <p className="text-sm text-gray-600">Preferências e personalizações</p>
              </div>
              <Switch
                checked={settings.includeSettings}
                onCheckedChange={(checked) => updateSetting("includeSettings", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opções Avançadas</CardTitle>
          <CardDescription>
            Configurações de compressão, criptografia e armazenamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Compressão</Label>
                <p className="text-sm text-gray-600">Reduz o tamanho dos arquivos de backup</p>
              </div>
              <Switch
                checked={settings.compression}
                onCheckedChange={(checked) => updateSetting("compression", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Criptografia</Label>
                <p className="text-sm text-gray-600">Protege os backups com criptografia</p>
              </div>
              <Switch
                checked={settings.encryption}
                onCheckedChange={(checked) => updateSetting("encryption", checked)}
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label>Local de Armazenamento</Label>
            <Select value={settings.cloudStorage} onValueChange={(value) => updateSetting("cloudStorage", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Armazenamento Local</SelectItem>
                <SelectItem value="aws">Amazon S3</SelectItem>
                <SelectItem value="google">Google Drive</SelectItem>
                <SelectItem value="dropbox">Dropbox</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Backups Disponíveis
          </CardTitle>
          <CardDescription>
            Histórico de backups e opções de restauração
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Backup Completo - 15/12/2024 02:00</p>
                <p className="text-sm text-gray-600">Tamanho: 125 MB | Status: Sucesso</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={handleRestore}>
                  Restaurar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Backup Completo - 14/12/2024 02:00</p>
                <p className="text-sm text-gray-600">Tamanho: 123 MB | Status: Sucesso</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={handleRestore}>
                  Restaurar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Backup Completo - 13/12/2024 02:00</p>
                <p className="text-sm text-gray-600">Tamanho: 121 MB | Status: Sucesso</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={handleRestore}>
                  Restaurar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ações Manuais</CardTitle>
          <CardDescription>
            Criar backup imediato ou restaurar dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isBackingUp && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Criando backup...</span>
                <span className="text-sm">{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleManualBackup} disabled={isBackingUp}>
              <Clock className="h-4 w-4 mr-2" />
              {isBackingUp ? "Criando Backup..." : "Criar Backup Agora"}
            </Button>
            
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Importar Backup
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
