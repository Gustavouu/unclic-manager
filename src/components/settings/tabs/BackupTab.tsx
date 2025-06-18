
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
import { Download, Upload, HardDrive, Cloud, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface BackupItem {
  id: string;
  name: string;
  date: string;
  size: string;
  type: "automatic" | "manual";
  status: "completed" | "in_progress" | "failed";
}

export const BackupTab = () => {
  const [settings, setSettings] = useState({
    automaticBackup: true,
    frequency: "daily",
    time: "02:00",
    retention: 30,
    cloudBackup: false,
    cloudProvider: "google",
    encryptBackups: true,
    notifyOnSuccess: true,
    notifyOnFailure: true,
    includeImages: true,
    includeDatabase: true,
    includeSettings: true
  });

  const [backups] = useState<BackupItem[]>([
    {
      id: "1",
      name: "Backup Automático - 2024-01-15",
      date: "2024-01-15 02:00:00",
      size: "15.2 MB",
      type: "automatic",
      status: "completed"
    },
    {
      id: "2", 
      name: "Backup Manual - 2024-01-14",
      date: "2024-01-14 14:30:00",
      size: "14.8 MB",
      type: "manual",
      status: "completed"
    },
    {
      id: "3",
      name: "Backup Automático - 2024-01-14",
      date: "2024-01-14 02:00:00",
      size: "14.9 MB",
      type: "automatic",
      status: "completed"
    },
    {
      id: "4",
      name: "Backup Automático - 2024-01-13",
      date: "2024-01-13 02:00:00",
      size: "0 MB",
      type: "automatic",
      status: "failed"
    }
  ]);

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);

    // Simular progresso do backup
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCreatingBackup(false);
          toast.success("Backup criado com sucesso!");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleRestoreBackup = (backupId: string) => {
    const backup = backups.find(b => b.id === backupId);
    if (backup) {
      toast.success(`Restauração iniciada do backup: ${backup.name}`);
    }
  };

  const handleDownloadBackup = (backupId: string) => {
    const backup = backups.find(b => b.id === backupId);
    if (backup) {
      toast.success(`Download iniciado: ${backup.name}`);
    }
  };

  const handleSave = () => {
    toast.success("Configurações de backup salvas com sucesso!");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">Em andamento</Badge>;
      case "failed":
        return <Badge variant="destructive">Falhou</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Backup Automático
          </CardTitle>
          <CardDescription>
            Configure backups automáticos para proteger seus dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Habilitar backup automático</Label>
              <p className="text-sm text-gray-600">Criar backups automaticamente</p>
            </div>
            <Switch
              checked={settings.automaticBackup}
              onCheckedChange={(checked) => updateSetting("automaticBackup", checked)}
            />
          </div>

          {settings.automaticBackup && (
            <>
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Frequência</Label>
                  <Select value={settings.frequency} onValueChange={(value) => updateSetting("frequency", value)}>
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
                    value={settings.time}
                    onChange={(e) => updateSetting("time", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="retention">Retenção (dias)</Label>
                  <Input
                    id="retention"
                    type="number"
                    value={settings.retention}
                    onChange={(e) => updateSetting("retention", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label>O que incluir no backup</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeDatabase"
                      checked={settings.includeDatabase}
                      onChange={(e) => updateSetting("includeDatabase", e.target.checked)}
                    />
                    <Label htmlFor="includeDatabase" className="text-sm">Banco de dados</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeImages"
                      checked={settings.includeImages}
                      onChange={(e) => updateSetting("includeImages", e.target.checked)}
                    />
                    <Label htmlFor="includeImages" className="text-sm">Imagens</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeSettings"
                      checked={settings.includeSettings}
                      onChange={(e) => updateSetting("includeSettings", e.target.checked)}
                    />
                    <Label htmlFor="includeSettings" className="text-sm">Configurações</Label>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Backup na Nuvem
          </CardTitle>
          <CardDescription>
            Configure backup automático na nuvem para máxima segurança
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Backup na nuvem</Label>
              <p className="text-sm text-gray-600">Enviar backups para armazenamento em nuvem</p>
            </div>
            <Switch
              checked={settings.cloudBackup}
              onCheckedChange={(checked) => updateSetting("cloudBackup", checked)}
            />
          </div>

          {settings.cloudBackup && (
            <>
              <div>
                <Label>Provedor de nuvem</Label>
                <Select value={settings.cloudProvider} onValueChange={(value) => updateSetting("cloudProvider", value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Drive</SelectItem>
                    <SelectItem value="dropbox">Dropbox</SelectItem>
                    <SelectItem value="aws">Amazon S3</SelectItem>
                    <SelectItem value="azure">Azure Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-medium text-blue-900 mb-2">Configuração necessária</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Para habilitar o backup na nuvem, você precisa configurar as credenciais do provedor selecionado.
                </p>
                <Button variant="outline" size="sm">
                  Configurar Credenciais
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>
            Configure opções de segurança para seus backups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Criptografar backups</Label>
              <p className="text-sm text-gray-600">Proteger backups com criptografia</p>
            </div>
            <Switch
              checked={settings.encryptBackups}
              onCheckedChange={(checked) => updateSetting("encryptBackups", checked)}
            />
          </div>

          <Separator />

          <div>
            <Label>Notificações</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Notificar quando backup for concluído</span>
                <Switch
                  checked={settings.notifyOnSuccess}
                  onCheckedChange={(checked) => updateSetting("notifyOnSuccess", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notificar quando backup falhar</span>
                <Switch
                  checked={settings.notifyOnFailure}
                  onCheckedChange={(checked) => updateSetting("notifyOnFailure", checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Manual</CardTitle>
          <CardDescription>
            Crie um backup imediato dos seus dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateBackup} 
              disabled={isCreatingBackup}
              className="flex items-center gap-2"
            >
              <HardDrive className="h-4 w-4" />
              {isCreatingBackup ? "Criando Backup..." : "Criar Backup Agora"}
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Restaurar de Arquivo
            </Button>
          </div>

          {isCreatingBackup && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso do backup</span>
                <span>{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Backups
          </CardTitle>
          <CardDescription>
            Visualize e gerencie seus backups anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((backup) => (
              <div key={backup.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(backup.status)}
                    <div>
                      <h4 className="font-medium">{backup.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{new Date(backup.date).toLocaleString("pt-BR")}</span>
                        <span>{backup.size}</span>
                        <Badge variant={backup.type === "automatic" ? "secondary" : "outline"}>
                          {backup.type === "automatic" ? "Automático" : "Manual"}
                        </Badge>
                        {getStatusBadge(backup.status)}
                      </div>
                    </div>
                  </div>
                  
                  {backup.status === "completed" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadBackup(backup.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreBackup(backup.id)}
                      >
                        Restaurar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Button variant="outline">Ver Todos os Backups</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Salvar Configurações de Backup
        </Button>
      </div>
    </div>
  );
};
