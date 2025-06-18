
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const AppointmentsTab = () => {
  const [settings, setSettings] = useState({
    allowOnlineBooking: true,
    requireAdvancePayment: false,
    minimumNoticeTime: 30,
    maximumDaysInAdvance: 30,
    automaticConfirmation: true,
    enableWaitlist: true,
    maxWaitlistSize: 10,
    allowRescheduling: true,
    rescheduleLimit: 24,
    enableCancellation: true,
    cancellationLimit: 2,
    autoReminders: true,
    reminderTime: 24,
    enableNoShow: true,
    noShowFee: 0,
    overbookingAllowed: false,
    simultaneousAppointments: 1,
    bufferTime: 15,
    defaultStatus: "confirmed",
    requireClientInfo: true,
    customFields: "",
    paymentMethods: {
      cash: true,
      card: true,
      pix: true,
      transfer: false
    }
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updatePaymentMethod = (method: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: enabled
      }
    }));
  };

  const handleSave = () => {
    toast.success("Configurações de agendamentos salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos Online</CardTitle>
          <CardDescription>
            Configure como os clientes podem fazer agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Permitir agendamentos online</Label>
              <p className="text-sm text-gray-600">Clientes podem agendar através do sistema</p>
            </div>
            <Switch
              checked={settings.allowOnlineBooking}
              onCheckedChange={(checked) => updateSetting("allowOnlineBooking", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Confirmação automática</Label>
              <p className="text-sm text-gray-600">Agendamentos são confirmados automaticamente</p>
            </div>
            <Switch
              checked={settings.automaticConfirmation}
              onCheckedChange={(checked) => updateSetting("automaticConfirmation", checked)}
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
                onChange={(e) => updateSetting("minimumNoticeTime", parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="maxDays">Máximo de dias de antecedência</Label>
              <Input
                id="maxDays"
                type="number"
                value={settings.maximumDaysInAdvance}
                onChange={(e) => updateSetting("maximumDaysInAdvance", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label>Status padrão dos agendamentos</Label>
            <Select value={settings.defaultStatus} onValueChange={(value) => updateSetting("defaultStatus", value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="waiting">Em espera</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Espera</CardTitle>
          <CardDescription>
            Configure a lista de espera para horários ocupados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Habilitar lista de espera</Label>
              <p className="text-sm text-gray-600">Clientes podem entrar em lista de espera</p>
            </div>
            <Switch
              checked={settings.enableWaitlist}
              onCheckedChange={(checked) => updateSetting("enableWaitlist", checked)}
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
                  onChange={(e) => updateSetting("maxWaitlistSize", parseInt(e.target.value))}
                  className="w-32"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reagendamento e Cancelamentos</CardTitle>
          <CardDescription>
            Configure políticas de reagendamento e cancelamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Permitir reagendamento</Label>
              <p className="text-sm text-gray-600">Clientes podem reagendar seus horários</p>
            </div>
            <Switch
              checked={settings.allowRescheduling}
              onCheckedChange={(checked) => updateSetting("allowRescheduling", checked)}
            />
          </div>

          {settings.allowRescheduling && (
            <>
              <Separator />
              <div>
                <Label htmlFor="rescheduleLimit">Limite para reagendamento (horas antes)</Label>
                <Input
                  id="rescheduleLimit"
                  type="number"
                  value={settings.rescheduleLimit}
                  onChange={(e) => updateSetting("rescheduleLimit", parseInt(e.target.value))}
                  className="w-32"
                />
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Permitir cancelamento</Label>
              <p className="text-sm text-gray-600">Clientes podem cancelar seus agendamentos</p>
            </div>
            <Switch
              checked={settings.enableCancellation}
              onCheckedChange={(checked) => updateSetting("enableCancellation", checked)}
            />
          </div>

          {settings.enableCancellation && (
            <>
              <Separator />
              <div>
                <Label htmlFor="cancellationLimit">Limite para cancelamento (horas antes)</Label>
                <Input
                  id="cancellationLimit"
                  type="number"
                  value={settings.cancellationLimit}
                  onChange={(e) => updateSetting("cancellationLimit", parseInt(e.target.value))}
                  className="w-32"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagamento</CardTitle>
          <CardDescription>
            Configure as opções de pagamento para agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Exigir pagamento antecipado</Label>
              <p className="text-sm text-gray-600">Clientes devem pagar ao agendar</p>
            </div>
            <Switch
              checked={settings.requireAdvancePayment}
              onCheckedChange={(checked) => updateSetting("requireAdvancePayment", checked)}
            />
          </div>

          <Separator />

          <div>
            <Label>Métodos de pagamento aceitos</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center justify-between">
                <span>Dinheiro</span>
                <Switch
                  checked={settings.paymentMethods.cash}
                  onCheckedChange={(checked) => updatePaymentMethod("cash", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Cartão</span>
                <Switch
                  checked={settings.paymentMethods.card}
                  onCheckedChange={(checked) => updatePaymentMethod("card", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>PIX</span>
                <Switch
                  checked={settings.paymentMethods.pix}
                  onCheckedChange={(checked) => updatePaymentMethod("pix", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Transferência</span>
                <Switch
                  checked={settings.paymentMethods.transfer}
                  onCheckedChange={(checked) => updatePaymentMethod("transfer", checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Avançadas</CardTitle>
          <CardDescription>
            Configurações adicionais para otimizar seus agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bufferTime">Tempo de intervalo (minutos)</Label>
              <Input
                id="bufferTime"
                type="number"
                value={settings.bufferTime}
                onChange={(e) => updateSetting("bufferTime", parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="simultaneousAppointments">Agendamentos simultâneos</Label>
              <Input
                id="simultaneousAppointments"
                type="number"
                value={settings.simultaneousAppointments}
                onChange={(e) => updateSetting("simultaneousAppointments", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customFields">Campos personalizados (separados por vírgula)</Label>
            <Textarea
              id="customFields"
              value={settings.customFields}
              onChange={(e) => updateSetting("customFields", e.target.value)}
              placeholder="Ex: Tipo de cabelo, Alergias, Preferências"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Permitir overbooking</Label>
              <p className="text-sm text-gray-600">Aceitar mais agendamentos que a capacidade</p>
            </div>
            <Switch
              checked={settings.overbookingAllowed}
              onCheckedChange={(checked) => updateSetting("overbookingAllowed", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Salvar Configurações de Agendamentos
        </Button>
      </div>
    </div>
  );
};
