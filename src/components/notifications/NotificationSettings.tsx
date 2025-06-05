
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, MessageSquare, Clock } from 'lucide-react';

export const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    appointmentReminders: true,
    paymentNotifications: true,
    marketingEmails: false,
    reminderTime: '24', // horas antes
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    emailTemplate: 'Olá {cliente}, você tem um agendamento marcado para {data} às {hora}. Por favor, confirme sua presença.',
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Salvando configurações de notificação:', settings);
    // Aqui implementaria a lógica de salvamento
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Canais de Notificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações por email
              </p>
            </div>
            <Switch
              checked={settings.emailEnabled}
              onCheckedChange={(checked) => handleSettingChange('emailEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">SMS</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações por SMS
              </p>
            </div>
            <Switch
              checked={settings.smsEnabled}
              onCheckedChange={(checked) => handleSettingChange('smsEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Push</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações push no navegador
              </p>
            </div>
            <Switch
              checked={settings.pushEnabled}
              onCheckedChange={(checked) => handleSettingChange('pushEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Notificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Lembretes de Agendamento</Label>
              <p className="text-sm text-muted-foreground">
                Notificar sobre agendamentos próximos
              </p>
            </div>
            <Switch
              checked={settings.appointmentReminders}
              onCheckedChange={(checked) => handleSettingChange('appointmentReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Notificações de Pagamento</Label>
              <p className="text-sm text-muted-foreground">
                Notificar sobre pagamentos pendentes
              </p>
            </div>
            <Switch
              checked={settings.paymentNotifications}
              onCheckedChange={(checked) => handleSettingChange('paymentNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Emails de Marketing</Label>
              <p className="text-sm text-muted-foreground">
                Receber promoções e novidades
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configurações de Tempo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tempo do Lembrete</Label>
            <Select value={settings.reminderTime} onValueChange={(value) => handleSettingChange('reminderTime', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hora antes</SelectItem>
                <SelectItem value="2">2 horas antes</SelectItem>
                <SelectItem value="4">4 horas antes</SelectItem>
                <SelectItem value="24">24 horas antes</SelectItem>
                <SelectItem value="48">48 horas antes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Horário Silencioso - Início</Label>
              <Input
                type="time"
                value={settings.quietHoursStart}
                onChange={(e) => handleSettingChange('quietHoursStart', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Horário Silencioso - Fim</Label>
              <Input
                type="time"
                value={settings.quietHoursEnd}
                onChange={(e) => handleSettingChange('quietHoursEnd', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Template de Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Mensagem do Lembrete</Label>
            <Textarea
              value={settings.emailTemplate}
              onChange={(e) => handleSettingChange('emailTemplate', e.target.value)}
              rows={4}
              placeholder="Digite a mensagem que será enviada aos clientes..."
            />
            <p className="text-xs text-muted-foreground">
              Use {'{cliente}'}, {'{data}'}, {'{hora}'} para personalizar a mensagem
            </p>
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
