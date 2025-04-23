import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { format, addDays, isAfter, isBefore, startOfDay, setHours, setMinutes, isSameDay, addMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { toast } from "sonner";

const dayMapping: Record<string, string> = {
  'domingo': 'domingo',
  'segunda-feira': 'segunda',
  'terça-feira': 'terca',
  'quarta-feira': 'quarta',
  'quinta-feira': 'quinta',
  'sexta-feira': 'sexta',
  'sábado': 'sabado'
};

export type DateTimeSelectProps = {
  form: UseFormReturn<AppointmentFormValues>;
  onTimeChange?: () => void;
  minAdvanceTime?: number;
  maxFutureDays?: number;
  businessHours?: Record<string, {
    enabled: boolean;
    start: string;
    end: string;
  }>;
};

export const DateTimeSelect = ({ 
  form, 
  onTimeChange, 
  minAdvanceTime = 30, 
  maxFutureDays = 30,
  businessHours = {}
}: DateTimeSelectProps) => {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  // Gerar horários disponíveis quando a data muda
  useEffect(() => {
    try {
      const selectedDate = form.getValues().date;
      if (!selectedDate) {
        setAvailableTimes([]);
        return;
      }
      
      // Obter o dia da semana e mapear para o formato correto
      const fullDayName = format(selectedDate, 'EEEE', { locale: ptBR }).toLowerCase();
      const dayOfWeek = dayMapping[fullDayName] || fullDayName;
      
      // Usar horários do negócio se disponíveis
      const hours = businessHours[dayOfWeek];
      
      if (!hours?.enabled) {
        setAvailableTimes([]);
        toast.error("Este dia não está disponível para agendamentos");
        return;
      }
      
      try {
        // Gerar slots de tempo baseados no horário de funcionamento
        const [startHour, startMinute] = hours.start.split(':').map(Number);
        const [endHour, endMinute] = hours.end.split(':').map(Number);
        
        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;
        
        const times: string[] = [];
        const now = new Date();
        
        // Gerar intervalos de 30 minutos
        for (let minutes = startTimeInMinutes; minutes < endTimeInMinutes; minutes += 30) {
          const hour = Math.floor(minutes / 60);
          const minute = minutes % 60;
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Verificar se o horário já passou (apenas para hoje)
          if (isSameDay(selectedDate, now)) {
            const timeDate = new Date(selectedDate);
            timeDate.setHours(hour, minute, 0, 0);
            
            if (isBefore(timeDate, addMinutes(now, minAdvanceTime))) {
              continue;
            }
          }
          
          times.push(timeStr);
        }
        
        setAvailableTimes(times);
        
        // Se não houver horários disponíveis, mostrar mensagem
        if (times.length === 0) {
          toast.error("Não há horários disponíveis nesta data");
        }
        
      } catch (error) {
        console.error("Erro ao gerar horários:", error);
        setAvailableTimes([]);
        toast.error("Erro ao carregar horários disponíveis");
      }
      
    } catch (error) {
      console.error("Erro ao processar data selecionada:", error);
      setAvailableTimes([]);
      toast.error("Erro ao processar a data selecionada");
    }
  }, [form.watch('date'), businessHours, minAdvanceTime]);
  
  // Função para verificar se o dia está disponível
  const isDateUnavailable = (date: Date) => {
    try {
      const today = startOfDay(new Date());
      
      // Não permitir datas no passado
      if (isBefore(date, today)) {
        return true;
      }
      
      // Não permitir datas muito no futuro
      if (maxFutureDays > 0 && isAfter(date, addDays(today, maxFutureDays))) {
        return true;
      }
      
      // Verificar se o dia está habilitado nos horários de funcionamento
      const fullDayName = format(date, 'EEEE', { locale: ptBR }).toLowerCase();
      const dayOfWeek = dayMapping[fullDayName] || fullDayName;
      
      const hours = businessHours[dayOfWeek];
      return !hours?.enabled;
      
    } catch (error) {
      console.error("Erro ao verificar disponibilidade da data:", error);
      return true; // Em caso de erro, bloquear a seleção
    }
  };
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Data</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    // Limpa a hora se a data mudar
                    form.setValue('time', '');
                  }}
                  disabled={isDateUnavailable}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Horário</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                if (onTimeChange) {
                  setTimeout(onTimeChange, 0);
                }
              }}
              value={field.value}
              disabled={!form.getValues().date || availableTimes.length === 0}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um horário">
                    {field.value ? (
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{field.value}</span>
                      </div>
                    ) : (
                      "Selecione um horário"
                    )}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableTimes.length > 0 ? (
                  availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{time}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-times" disabled>
                    {form.getValues().date
                      ? "Nenhum horário disponível nesta data"
                      : "Selecione uma data primeiro"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
