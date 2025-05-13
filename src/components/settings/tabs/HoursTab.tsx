
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useBusinessConfig } from "@/hooks/business/useBusinessConfig";

export const HoursTab = () => {
  const { businessHours, saving, updateBusinessHours, saveBusinessHours, bufferTime, minAdvanceTime, saveConfig } = useBusinessConfig();
  const [isEditing, setIsEditing] = useState(false);
  const [localBufferTime, setLocalBufferTime] = useState(bufferTime.toString());
  const [localMinAdvanceTime, setLocalMinAdvanceTime] = useState(minAdvanceTime.toString());
  
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
    if (!isEditing) return;
    updateBusinessHours(day, { open: checked });
  };
  
  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    if (!isEditing) return;
    updateBusinessHours(day, { [field]: value });
  };
  
  const handleBufferTimeChange = (value: string) => {
    setLocalBufferTime(value);
  };
  
  const handleMinAdvanceTimeChange = (value: string) => {
    setLocalMinAdvanceTime(value);
  };
  
  const handleSaveChanges = async () => {
    try {
      // Salvar os horários de funcionamento
      const hoursSuccess = await saveBusinessHours();
      
      // Salvar os ajustes adicionais
      const bufferTimeValue = parseInt(localBufferTime) || 0;
      const minAdvanceTimeValue = parseInt(localMinAdvanceTime) || 0;
      
      const configSuccess = await saveConfig({
        bufferTime: bufferTimeValue,
        minAdvanceTime: minAdvanceTimeValue,
      });
      
      if (hoursSuccess && configSuccess) {
        toast.success("Todas as configurações de horário foram salvas com sucesso");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Ocorreu um erro ao salvar as configurações de horário");
    }
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Ao entrar no modo de edição, atualizar as variáveis locais
      setLocalBufferTime(bufferTime.toString());
      setLocalMinAdvanceTime(minAdvanceTime.toString());
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horários de Funcionamento</CardTitle>
        <CardDescription>
          Defina os horários de funcionamento do seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-end mb-4">
          <Button 
            variant={isEditing ? "default" : "outline"} 
            onClick={handleEditToggle}
          >
            {isEditing ? "Cancelar Edição" : "Editar Horários"}
          </Button>
        </div>
        
        <div className="rounded-lg border">
          {days.map((day) => (
            <div 
              key={day.key} 
              className="grid grid-cols-4 sm:grid-cols-7 gap-4 items-center p-4 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-2">
                <Switch 
                  id={`day-${day.key}`} 
                  checked={businessHours[day.key].open}
                  onCheckedChange={(checked) => handleToggleDay(day.key, checked)}
                  disabled={!isEditing}
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
                        value={businessHours[day.key].openTime}
                        onValueChange={(value) => handleTimeChange(day.key, 'openTime', value)}
                        disabled={!isEditing || !businessHours[day.key].open}
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
                        value={businessHours[day.key].closeTime}
                        onValueChange={(value) => handleTimeChange(day.key, 'closeTime', value)}
                        disabled={!isEditing || !businessHours[day.key].open}
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
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Ajustes Adicionais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="break-time">Tempo de Intervalo</Label>
              <Select value={localBufferTime} onValueChange={handleBufferTimeChange} disabled={!isEditing}>
                <SelectTrigger id="break-time">
                  <SelectValue placeholder="Selecione o tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sem Intervalo</SelectItem>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="10">10 minutos</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Intervalo entre agendamentos para preparação
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="min-advance-time">Antecedência Mínima</Label>
              <Select value={localMinAdvanceTime} onValueChange={handleMinAdvanceTimeChange} disabled={!isEditing}>
                <SelectTrigger id="min-advance-time">
                  <SelectValue placeholder="Selecione o tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sem Antecedência</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                  <SelectItem value="180">3 horas</SelectItem>
                  <SelectItem value="360">6 horas</SelectItem>
                  <SelectItem value="720">12 horas</SelectItem>
                  <SelectItem value="1440">1 dia</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Tempo mínimo para agendamento
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isEditing && (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button onClick={handleSaveChanges} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
