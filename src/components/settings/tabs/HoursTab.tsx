
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

interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart?: string;
  breakEnd?: string;
  hasBreak: boolean;
}

interface WeekSchedule {
  [key: string]: DaySchedule;
}

export const HoursTab = () => {
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: { isOpen: true, openTime: "09:00", closeTime: "18:00", hasBreak: false, breakStart: "12:00", breakEnd: "13:00" },
    tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00", hasBreak: false, breakStart: "12:00", breakEnd: "13:00" },
    wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00", hasBreak: false, breakStart: "12:00", breakEnd: "13:00" },
    thursday: { isOpen: true, openTime: "09:00", closeTime: "18:00", hasBreak: false, breakStart: "12:00", breakEnd: "13:00" },
    friday: { isOpen: true, openTime: "09:00", closeTime: "18:00", hasBreak: false, breakStart: "12:00", breakEnd: "13:00" },
    saturday: { isOpen: true, openTime: "09:00", closeTime: "16:00", hasBreak: false, breakStart: "12:00", breakEnd: "13:00" },
    sunday: { isOpen: false, openTime: "09:00", closeTime: "16:00", hasBreak: false, breakStart: "12:00", breakEnd: "13:00" }
  });

  const [settings, setSettings] = useState({
    appointmentInterval: 30,
    timezone: "America/Sao_Paulo",
    allowBookingOutsideHours: false,
    extendedHoursRate: 1.5,
    holidayScheduleEnabled: true,
    bufferBetweenAppointments: 0,
    lastAppointmentTime: 30
  });

  const dayNames = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira", 
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo"
  };

  const updateDaySchedule = (day: string, field: string, value: any) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const copySchedule = (fromDay: string, toDay: string) => {
    setSchedule(prev => ({
      ...prev,
      [toDay]: { ...prev[fromDay] }
    }));
    toast.success(`Horário de ${dayNames[fromDay as keyof typeof dayNames]} copiado para ${dayNames[toDay as keyof typeof dayNames]}`);
  };

  const setAllDays = (scheduleData: DaySchedule) => {
    const newSchedule: WeekSchedule = {};
    Object.keys(schedule).forEach(day => {
      newSchedule[day] = { ...scheduleData };
    });
    setSchedule(newSchedule);
    toast.success("Horário aplicado para todos os dias");
  };

  const handleSave = () => {
    toast.success("Horários de funcionamento salvos com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Configure as opções globais de horário de funcionamento
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
              <Label htmlFor="appointmentInterval">Intervalo entre agendamentos (minutos)</Label>
              <Input
                id="appointmentInterval"
                type="number"
                value={settings.appointmentInterval}
                onChange={(e) => updateSetting("appointmentInterval", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bufferBetweenAppointments">Buffer entre agendamentos (minutos)</Label>
              <Input
                id="bufferBetweenAppointments"
                type="number"
                value={settings.bufferBetweenAppointments}
                onChange={(e) => updateSetting("bufferBetweenAppointments", parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="lastAppointmentTime">Último agendamento (minutos antes do fechamento)</Label>
              <Input
                id="lastAppointmentTime"
                type="number"
                value={settings.lastAppointmentTime}
                onChange={(e) => updateSetting("lastAppointmentTime", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Permitir agendamentos fora do horário</Label>
              <p className="text-sm text-gray-600">Com taxa adicional</p>
            </div>
            <Switch
              checked={settings.allowBookingOutsideHours}
              onCheckedChange={(checked) => updateSetting("allowBookingOutsideHours", checked)}
            />
          </div>

          {settings.allowBookingOutsideHours && (
            <div>
              <Label htmlFor="extendedHoursRate">Taxa adicional (multiplicador)</Label>
              <Input
                id="extendedHoursRate"
                type="number"
                step="0.1"
                value={settings.extendedHoursRate}
                onChange={(e) => updateSetting("extendedHoursRate", parseFloat(e.target.value))}
                className="w-32"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horários de Funcionamento</CardTitle>
          <CardDescription>
            Configure os horários para cada dia da semana
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setAllDays({ isOpen: true, openTime: "09:00", closeTime: "18:00", hasBreak: false, breakStart: "12:00", breakEnd: "13:00" })}
            >
              Aplicar 9h-18h para todos
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setAllDays({ isOpen: true, openTime: "08:00", closeTime: "17:00", hasBreak: true, breakStart: "12:00", breakEnd: "13:00" })}
            >
              Aplicar 8h-17h (com almoço) para todos
            </Button>
          </div>

          {Object.entries(schedule).map(([day, daySchedule]) => (
            <div key={day} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{dayNames[day as keyof typeof dayNames]}</h3>
                  {!daySchedule.isOpen && <Badge variant="secondary">Fechado</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={daySchedule.isOpen}
                    onCheckedChange={(checked) => updateDaySchedule(day, "isOpen", checked)}
                  />
                  <Select value={day} onValueChange={(toDay) => copySchedule(day, toDay)}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Copiar para..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(dayNames).map(([dayKey, dayName]) => (
                        dayKey !== day && (
                          <SelectItem key={dayKey} value={dayKey}>
                            {dayName}
                          </SelectItem>
                        )
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {daySchedule.isOpen && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Abertura</Label>
                      <Input
                        type="time"
                        value={daySchedule.openTime}
                        onChange={(e) => updateDaySchedule(day, "openTime", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Fechamento</Label>
                      <Input
                        type="time"
                        value={daySchedule.closeTime}
                        onChange={(e) => updateDaySchedule(day, "closeTime", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Intervalo para almoço</Label>
                    <Switch
                      checked={daySchedule.hasBreak}
                      onCheckedChange={(checked) => updateDaySchedule(day, "hasBreak", checked)}
                    />
                  </div>

                  {daySchedule.hasBreak && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Início do intervalo</Label>
                        <Input
                          type="time"
                          value={daySchedule.breakStart}
                          onChange={(e) => updateDaySchedule(day, "breakStart", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Fim do intervalo</Label>
                        <Input
                          type="time"
                          value={daySchedule.breakEnd}
                          onChange={(e) => updateDaySchedule(day, "breakEnd", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feriados e Datas Especiais</CardTitle>
          <CardDescription>
            Configure horários especiais para feriados e datas comemorativas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Ativar horários especiais</Label>
              <p className="text-sm text-gray-600">Configure horários diferentes para feriados</p>
            </div>
            <Switch
              checked={settings.holidayScheduleEnabled}
              onCheckedChange={(checked) => updateSetting("holidayScheduleEnabled", checked)}
            />
          </div>

          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600">
              Funcionalidade em desenvolvimento. Em breve você poderá configurar horários especiais para:
            </p>
            <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
              <li>Feriados nacionais</li>
              <li>Datas comemorativas</li>
              <li>Fechamentos temporários</li>
              <li>Horários estendidos</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Salvar Horários de Funcionamento
        </Button>
      </div>
    </div>
  );
};
