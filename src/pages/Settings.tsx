
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Building2, 
  Clock, 
  Users, 
  Bell, 
  Palette, 
  CreditCard,
  Shield,
  Settings as SettingsIcon
} from 'lucide-react';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { toast } from 'sonner';

interface BusinessSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  allowOnlineBooking: boolean;
  requireAdvancePayment: boolean;
  minimumNoticeTime: number;
  maximumDaysInAdvance: number;
  enableReminders: boolean;
  reminderTime: number;
  enableWaitlist: boolean;
  maxWaitlistSize: number;
}

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings>({
    name: 'Barbearia Premium',
    email: 'contato@barbeariapremium.com',
    phone: '(11) 99999-9999',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    description: 'Barbearia moderna com serviços premium',
    primaryColor: '#213858',
    secondaryColor: '#33c3f0',
    allowOnlineBooking: true,
    requireAdvancePayment: false,
    minimumNoticeTime: 30,
    maximumDaysInAdvance: 30,
    enableReminders: true,
    reminderTime: 24,
    enableWaitlist: true,
    maxWaitlistSize: 10,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof BusinessSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <OnboardingRedirect>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Gerencie as configurações do seu negócio</p>
          </div>
          
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>

        <Tabs defaultValue="business" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Negócio</span>
            </TabsTrigger>
            <TabsTrigger value="hours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Horários</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Equipe</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Aparência</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Pagamentos</span>
            </TabsTrigger>
          </TabsList>

          {/* Business Settings */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Negócio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Negócio</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) => updateSetting('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSetting('email', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => updateSetting('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={settings.zipCode}
                      onChange={(e) => updateSetting('zipCode', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => updateSetting('address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={settings.city}
                      onChange={(e) => updateSetting('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Select value={settings.state} onValueChange={(value) => updateSetting('state', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        {/* Adicionar outros estados */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={settings.description}
                    onChange={(e) => updateSetting('description', e.target.value)}
                    placeholder="Descreva seu negócio"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Permitir agendamentos online</Label>
                    <p className="text-sm text-gray-600">Clientes podem agendar através do sistema</p>
                  </div>
                  <Switch
                    checked={settings.allowOnlineBooking}
                    onCheckedChange={(checked) => updateSetting('allowOnlineBooking', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Exigir pagamento antecipado</Label>
                    <p className="text-sm text-gray-600">Clientes devem pagar ao agendar</p>
                  </div>
                  <Switch
                    checked={settings.requireAdvancePayment}
                    onCheckedChange={(checked) => updateSetting('requireAdvancePayment', checked)}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minimumNotice">Aviso mínimo (minutos)</Label>
                    <Input
                      id="minimumNotice"
                      type="number"
                      value={settings.minimumNoticeTime}
                      onChange={(e) => updateSetting('minimumNoticeTime', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxDays">Máximo de dias de antecedência</Label>
                    <Input
                      id="maxDays"
                      type="number"
                      value={settings.maximumDaysInAdvance}
                      onChange={(e) => updateSetting('maximumDaysInAdvance', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hours Settings */}
          <TabsContent value="hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Horários de Funcionamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day) => (
                    <div key={day} className="flex items-center justify-between">
                      <div className="w-20">
                        <Label>{day}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="time" defaultValue="09:00" className="w-32" />
                        <span>às</span>
                        <Input type="time" defaultValue="18:00" className="w-32" />
                        <Switch defaultChecked />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Settings */}
          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Equipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Permitir múltiplos profissionais por serviço</Label>
                      <p className="text-sm text-gray-600">Clientes podem escolher o profissional</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Comissão padrão (%)</Label>
                      <p className="text-sm text-gray-600">Percentual padrão para novos funcionários</p>
                    </div>
                    <Input type="number" defaultValue="40" className="w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lembretes e Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enviar lembretes por email</Label>
                    <p className="text-sm text-gray-600">Lembretes automáticos para clientes</p>
                  </div>
                  <Switch
                    checked={settings.enableReminders}
                    onCheckedChange={(checked) => updateSetting('enableReminders', checked)}
                  />
                </div>

                {settings.enableReminders && (
                  <>
                    <Separator />
                    <div>
                      <Label htmlFor="reminderTime">Tempo do lembrete (horas antes)</Label>
                      <Input
                        id="reminderTime"
                        type="number"
                        value={settings.reminderTime}
                        onChange={(e) => updateSetting('reminderTime', parseInt(e.target.value))}
                        className="w-32"
                      />
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Habilitar lista de espera</Label>
                    <p className="text-sm text-gray-600">Clientes podem entrar em lista de espera</p>
                  </div>
                  <Switch
                    checked={settings.enableWaitlist}
                    onCheckedChange={(checked) => updateSetting('enableWaitlist', checked)}
                  />
                </div>

                {settings.enableWaitlist && (
                  <>
                    <Separator />
                    <div>
                      <Label htmlFor="maxWaitlist">Tamanho máximo da lista</Label>
                      <Input
                        id="maxWaitlist"
                        type="number"
                        value={settings.maxWaitlistSize}
                        onChange={(e) => updateSetting('maxWaitlistSize', parseInt(e.target.value))}
                        className="w-32"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalização Visual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => updateSetting('primaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => updateSetting('primaryColor', e.target.value)}
                        placeholder="#213858"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.secondaryColor}
                        onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                        placeholder="#33c3f0"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <Label>Preview das Cores</Label>
                  <div className="mt-2 flex gap-2">
                    <div 
                      className="w-20 h-10 rounded border"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <div 
                      className="w-20 h-10 rounded border"
                      style={{ backgroundColor: settings.secondaryColor }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Settings */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Dinheiro</span>
                      <Badge variant="secondary">Ativo</Badge>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>PIX</span>
                      <Badge variant="secondary">Ativo</Badge>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Cartão de Crédito</span>
                      <Badge variant="outline">Inativo</Badge>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Cartão de Débito</span>
                      <Badge variant="outline">Inativo</Badge>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </OnboardingRedirect>
  );
};

export default Settings;
