
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { toast } from "sonner";

export const HoursTab = () => {
  const { businessHours, updateBusinessHours, saveProgress } = useOnboarding();
  const [isEditing, setIsEditing] = useState(false);
  
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
    if (!businessHours) return;
    
    const updatedHours = {
      ...businessHours,
      [day]: {
        ...businessHours[day],
        open: checked,
        isOpen: checked
      }
    };
    updateBusinessHours(updatedHours);
  };
  
  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    if (!businessHours) return;
    
    const updatedHours = {
      ...businessHours,
      [day]: {
        ...businessHours[day],
        [field]: value,
        [field === 'openTime' ? 'start' : 'end']: value
      }
    };
    updateBusinessHours(updatedHours);
  };
  
  const handleSaveChanges = () => {
    saveProgress();
    toast.success("Horários salvos com sucesso!");
    setIsEditing(false);
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  if (!businessHours) {
    return <div>Carregando...</div>;
  }

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
                  checked={businessHours[day.key]?.open || false}
                  onCheckedChange={(checked) => handleToggleDay(day.key, checked)}
                  disabled={!isEditing}
                />
                <Label htmlFor={`day-${day.key}`} className="font-medium">
                  {day.label}
                </Label>
              </div>
              
              <div className="col-span-3 sm:col-span-6 grid grid-cols-2 gap-2">
                {businessHours[day.key]?.open ? (
                  <>
                    <div>
                      <Label htmlFor={`open-${day.key}`} className="text-sm text-muted-foreground mb-1 block">
                        Abertura
                      </Label>
                      <Select
                        value={businessHours[day.key]?.openTime || "09:00"}
                        onValueChange={(value) => handleTimeChange(day.key, 'openTime', value)}
                        disabled={!isEditing || !businessHours[day.key]?.open}
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
                        value={businessHours[day.key]?.closeTime || "18:00"}
                        onValueChange={(value) => handleTimeChange(day.key, 'closeTime', value)}
                        disabled={!isEditing || !businessHours[day.key]?.open}
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
              <Select defaultValue="0" disabled={!isEditing}>
                <SelectTrigger id="break-time">
                  <SelectValue placeholder="Selecione o tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sem Intervalo</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buffer-time">Tempo de Preparação</Label>
              <Select defaultValue="0" disabled={!isEditing}>
                <SelectTrigger id="buffer-time">
                  <SelectValue placeholder="Selecione o tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sem Preparação</SelectItem>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="10">10 minutos</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isEditing && (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
