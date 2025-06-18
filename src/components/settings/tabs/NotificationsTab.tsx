
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
import { Bell, Mail, MessageSquare, Calendar, Users } from "lucide-react";
import { toast } from "sonner";

const NotificationsTab = () => {
  const [settings, setSettings] = useState({
    // Email notifications
    emailNotifications: true,
    emailProvider: "default",
    emailTemplate: "modern",
    fromEmail: "contato@seunegoio.com",
    fromName: "Seu Negócio",
    
    // SMS notifications
    smsNotifications: false,
    smsProvider: "twilio",
    
    // WhatsApp notifications
    whatsappNotifications: false,
    whatsappBusinessId: "",
    
    // Appointment reminders
    appointmentReminders: {
      enabled: true,
      reminderTimes: [24, 2], // hours before
      channels: ["email"],
      customMessage: ""
    },
    
    // Birthday reminders
    birthdayReminders: {
      enabled: true,
      daysInAdvance: 3,
      channels: ["email"],
      includeOffer: true,
      offerPercentage: 10
    },
    
    // System notifications
    systemNotifications: {
      newAppointments: true,
      cancellations: true,
      noShows: true,
      payments: true,
      lowStock: true,
      staffUpdates: false
    },
    
    // Marketing
    marketingEmails: {
      enabled: false,
      frequency: "weekly",
      segmentation: true
    },
    
    // Internal notifications
    internalNotifications: {
      email: true,
      browser: true,
      mobile: false
    }
  });

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    setSettings(prev => {
      const newSettings = { ...prev };
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i] as keyof typeof current];
      }
      
      (current as any)[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSave = () => {
    toast.success("Configurações de notificações salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>
            Configure as preferências globais de notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notificações por email</Label>
              <p className="text-sm text-gray-600">Enviar notificações via email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Notificações por SMS</Label>
              <p className="text-sm text-gray-600">Enviar notificações via SMS</p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Notificações por WhatsApp</Label>
              <p className="text-sm text-gray-600">Enviar notificações via WhatsApp Business</p>
            </div>
            <Switch
              checked={settings.whatsappNotifications}
              onCheckedChange={(checked) => updateSetting("whatsappNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configurações de Email
          </CardTitle>
          <CardDescription>
            Configure as opções para envio de emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromEmail">Email remetente</Label>
              <Input
                id="fromEmail"
                type="email"
                value={settings.fromEmail}
                onChange={(e) => updateSetting("fromEmail", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fromName">Nome do remetente</Label>
              <Input
                id="fromName"
                value={settings.fromName}
                onChange={(e) => updateSetting("fromName", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Template de email</Label>
            <Select 
              value={settings.emailTemplate} 
              onValueChange={(value) => updateSetting("emailTemplate", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Moderno</SelectItem>
                <SelectItem value="classic">Clássico</SelectItem>
                <SelectItem value="minimalist">Minimalista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Provedor de email</Label>
            <Select 
              value={settings.emailProvider} 
              onValueChange={(value) => updateSetting("emailProvider", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Padrão do sistema</SelectItem>
                <SelectItem value="smtp">SMTP personalizado</SelectItem>
                <SelectItem value="sendgrid">SendGrid</SelectItem>
                <SelectItem value="mailgun">Mailgun</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lembretes de Agendamentos
          </CardTitle>
          <CardDescription>
            Configure lembretes automáticos para clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Habilitar lembretes</Label>
              <p className="text-sm text-gray-600">Enviar lembretes automáticos</p>
            </div>
            <Switch
              checked={settings.appointmentReminders.enabled}
              onCheckedChange={(checked) => updateSetting("appointmentReminders.enabled", checked)}
            />
          </div>

          {settings.appointmentReminders.enabled && (
            <>
              <div>
                <Label>Horários dos lembretes (horas antes)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    placeholder="24"
                    className="w-20"
                    defaultValue="24"
                  />
                  <Input
                    type="number"
                    placeholder="2"
                    className="w-20"
                    defaultValue="2"
                  />
                  <Button variant="outline" size="sm">
                    + Adicionar
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Lembretes serão enviados 24h e 2h antes do agendamento
                </p>
              </div>

              <div>
                <Label>Canais de envio</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="email-reminder" defaultChecked />
                    <Label htmlFor="email-reminder" className="text-sm">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sms-reminder" />
                    <Label htmlFor="sms-reminder" className="text-sm">SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="whatsapp-reminder" />
                    <Label htmlFor="whatsapp-reminder" className="text-sm">WhatsApp</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="customMessage">Mensagem personalizada</Label>
                <Textarea
                  id="customMessage"
                  placeholder="Olá [CLIENTE], lembramos que você tem um agendamento marcado para [DATA] às [HORA]..."
                  className="mt-1"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lembretes de Aniversário
          </CardTitle>
          <CardDescription>
            Configure lembretes automáticos para aniversários de clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Habilitar lembretes de aniversário</Label>
              <p className="text-sm text-gray-600">Enviar parabéns automáticos</p>
            </div>
            <Switch
              checked={settings.birthdayReminders.enabled}
              onCheckedChange={(checked) => updateSetting("birthdayReminders.enabled", checked)}
            />
          </div>

          {settings.birthdayReminders.enabled && (
            <>
              <div>
                <Label htmlFor="daysInAdvance">Enviar com antecedência (dias)</Label>
                <Input
                  id="daysInAdvance"
                  type="number"
                  value={settings.birthdayReminders.daysInAdvance}
                  onChange={(e) => updateSetting("birthdayReminders.daysInAdvance", parseInt(e.target.value))}
                  className="w-32"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Incluir oferta especial</Label>
                  <p className="text-sm text-gray-600">Oferecer desconto de aniversário</p>
                </div>
                <Switch
                  checked={settings.birthdayReminders.includeOffer}
                  onCheckedChange={(checked) => updateSetting("birthdayReminders.includeOffer", checked)}
                />
              </div>

              {settings.birthdayReminders.includeOffer && (
                <div>
                  <Label htmlFor="offerPercentage">Percentual de desconto (%)</Label>
                  <Input
                    id="offerPercentage"
                    type="number"
                    value={settings.birthdayReminders.offerPercentage}
                    onChange={(e) => updateSetting("birthdayReminders.offerPercentage", parseInt(e.target.value))}
                    className="w-32"
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificações do Sistema</CardTitle>
          <CardDescription>
            Configure quando você quer ser notificado sobre eventos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Novos agendamentos</Label>
              <Switch
                checked={settings.systemNotifications.newAppointments}
                onCheckedChange={(checked) => updateSetting("systemNotifications.newAppointments", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Cancelamentos</Label>
              <Switch
                checked={settings.systemNotifications.cancellations}
                onCheckedChange={(checked) => updateSetting("systemNotifications.cancellations", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Faltas (no-show)</Label>
              <Switch
                checked={settings.systemNotifications.noShows}
                onCheckedChange={(checked) => updateSetting("systemNotifications.noShows", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Pagamentos recebidos</Label>
              <Switch
                checked={settings.systemNotifications.payments}
                onCheckedChange={(checked) => updateSetting("systemNotifications.payments", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Estoque baixo</Label>
              <Switch
                checked={settings.systemNotifications.lowStock}
                onCheckedChange={(checked) => updateSetting("systemNotifications.lowStock", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Atualizações da equipe</Label>
              <Switch
                checked={settings.systemNotifications.staffUpdates}
                onCheckedChange={(checked) => updateSetting("systemNotifications.staffUpdates", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Marketing e Campanhas
          </CardTitle>
          <CardDescription>
            Configure emails de marketing e campanhas promocionais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Emails de marketing</Label>
              <p className="text-sm text-gray-600">Enviar campanhas promocionais</p>
            </div>
            <Switch
              checked={settings.marketingEmails.enabled}
              onCheckedChange={(checked) => updateSetting("marketingEmails.enabled", checked)}
            />
          </div>

          {settings.marketingEmails.enabled && (
            <>
              <div>
                <Label>Frequência</Label>
                <Select 
                  value={settings.marketingEmails.frequency} 
                  onValueChange={(value) => updateSetting("marketingEmails.frequency", value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="custom">Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Segmentação de clientes</Label>
                  <p className="text-sm text-gray-600">Enviar emails segmentados por perfil</p>
                </div>
                <Switch
                  checked={settings.marketingEmails.segmentation}
                  onCheckedChange={(checked) => updateSetting("marketingEmails.segmentation", checked)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificações Internas</CardTitle>
          <CardDescription>
            Configure como você quer receber notificações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Notificações por email</Label>
            <Switch
              checked={settings.internalNotifications.email}
              onCheckedChange={(checked) => updateSetting("internalNotifications.email", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Notificações no navegador</Label>
            <Switch
              checked={settings.internalNotifications.browser}
              onCheckedChange={(checked) => updateSetting("internalNotifications.browser", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Notificações push (mobile)</Label>
            <Switch
              checked={settings.internalNotifications.mobile}
              onCheckedChange={(checked) => updateSetting("internalNotifications.mobile", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Salvar Configurações de Notificações
        </Button>
      </div>
    </div>
  );
};

export default NotificationsTab;
