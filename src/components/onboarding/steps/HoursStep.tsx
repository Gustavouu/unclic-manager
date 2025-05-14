
import React from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const HoursStep: React.FC = () => {
  const { businessHours, updateBusinessHours } = useOnboarding();
  
  const days = [
    { key: "monday", label: "Segunda-feira" },
    { key: "tuesday", label: "Terça-feira" },
    { key: "wednesday", label: "Quarta-feira" },
    { key: "thursday", label: "Quinta-feira" },
    { key: "friday", label: "Sexta-feira" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" }
  ];
  
  const timeOptions = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", 
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", 
    "22:00", "22:30", "23:00", "23:30"
  ];
  
  const handleToggleDay = (day: string, checked: boolean) => {
    updateBusinessHours(day, { open: checked });
  };
  
  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    updateBusinessHours(day, { [field]: value });
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Horários de Funcionamento</h3>
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          {days.map((day) => (
            <div 
              key={day.key} 
              className="grid grid-cols-4 sm:grid-cols-7 gap-4 items-center pb-4 border-b last:border-b-0 last:pb-0"
            >
              <div className="flex items-center space-x-2">
                <Switch 
                  id={`day-${day.key}`} 
                  checked={businessHours[day.key].open}
                  onCheckedChange={(checked) => handleToggleDay(day.key, checked)}
                />
                <Label htmlFor={`day-${day.key}`} className="font-medium">
                  {day.label}
                </Label>
              </div>
              
              <div className="col-span-3 sm:col-span-6 grid grid-cols-2 gap-2">
                {businessHours[day.key].open ? (
                  <>
                    <div>
                      <Label htmlFor={`open-${day.key}`} className="text-sm text-muted-foreground mb-1 block">
                        Abertura
                      </Label>
                      <Select
                        value={businessHours[day.key].openTime || "09:00"}
                        onValueChange={(value) => handleTimeChange(day.key, 'openTime', value)}
                        disabled={!businessHours[day.key].open}
                      >
                        <SelectTrigger id={`open-${day.key}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={`open-${day.key}-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`close-${day.key}`} className="text-sm text-muted-foreground mb-1 block">
                        Fechamento
                      </Label>
                      <Select
                        value={businessHours[day.key].closeTime || "18:00"}
                        onValueChange={(value) => handleTimeChange(day.key, 'closeTime', value)}
                        disabled={!businessHours[day.key].open}
                      >
                        <SelectTrigger id={`close-${day.key}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={`close-${day.key}-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Fechado</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-base font-medium mb-4">Dicas para Horários de Funcionamento</h4>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Configure os horários de acordo com a demanda de clientes em cada dia.</li>
            <li>Considere deixar um dia da semana fechado para descanso ou tarefas administrativas.</li>
            <li>Para estabelecimentos com múltiplos funcionários, considere horários escalonados.</li>
            <li>Você poderá ajustar esses horários posteriormente nas configurações do sistema.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
