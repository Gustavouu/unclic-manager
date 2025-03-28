
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

export const DateTimeSelect = ({ form }: { form: UseFormReturn<AppointmentFormValues> }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(form.getValues().date);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(timeSlots);
  const [loading, setLoading] = useState(false);
  
  const professionalId = form.watch("professionalId");
  const serviceId = form.watch("serviceId");
  
  // Check available time slots when date or professional changes
  useEffect(() => {
    if (!selectedDate || !professionalId) return;
    
    const checkAvailableTimeSlots = async () => {
      setLoading(true);
      try {
        // Format date for database query
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        
        // Get service duration
        const { data: serviceData } = await supabase
          .from('servicos')
          .select('duracao')
          .eq('id', serviceId)
          .single();
          
        const serviceDuration = serviceData?.duracao || 60;
        
        // Get existing appointments for this professional on this date
        const { data: appointments, error } = await supabase
          .from('agendamentos')
          .select('hora_inicio, hora_fim')
          .eq('data', dateStr)
          .eq('id_funcionario', professionalId);
          
        if (error) throw error;
        
        // Check day of week to get business hours
        const dayOfWeek = selectedDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
        
        // Get business hours for this day
        const { data: businessHours } = await supabase
          .from('horarios_disponibilidade')
          .select('hora_inicio, hora_fim, dia_folga')
          .eq('dia_semana', dayOfWeek)
          .eq('id_funcionario', professionalId)
          .maybeSingle(); // Use maybeSingle as there might not be a specific config
          
        // Check if it's a day off
        if (businessHours?.dia_folga) {
          setAvailableTimeSlots([]);
          setLoading(false);
          return;
        }
        
        // Use default business hours if no specific configuration
        const startTime = businessHours?.hora_inicio || '08:00:00';
        const endTime = businessHours?.hora_fim || '18:00:00';
        
        // Filter time slots based on business hours and existing appointments
        const filteredSlots = timeSlots.filter(slot => {
          // Check if slot is within business hours
          if (slot.concat(':00') < startTime || slot.concat(':00') > endTime) {
            return false;
          }
          
          // Parse slot time
          const [hours, minutes] = slot.split(':').map(Number);
          const slotDate = new Date(selectedDate);
          slotDate.setHours(hours, minutes, 0, 0);
          
          // Calculate the end time of this appointment
          const endSlotDate = new Date(slotDate.getTime() + serviceDuration * 60000);
          
          // Check if slot overlaps with any existing appointment
          return !appointments?.some(appointment => {
            const apptStart = appointment.hora_inicio;
            const apptEnd = appointment.hora_fim;
            
            // Convert appointment times to Date objects for comparison
            const [apptStartHours, apptStartMinutes] = apptStart.split(':').map(Number);
            const [apptEndHours, apptEndMinutes] = apptEnd.split(':').map(Number);
            
            const apptStartDate = new Date(selectedDate);
            apptStartDate.setHours(apptStartHours, apptStartMinutes, 0, 0);
            
            const apptEndDate = new Date(selectedDate);
            apptEndDate.setHours(apptEndHours, apptEndMinutes, 0, 0);
            
            // Check for overlap
            return (
              (slotDate < apptEndDate && endSlotDate > apptStartDate)
            );
          });
        });
        
        setAvailableTimeSlots(filteredSlots);
      } catch (error) {
        console.error('Error checking available time slots:', error);
        // Fall back to all time slots on error
        setAvailableTimeSlots(timeSlots);
      } finally {
        setLoading(false);
      }
    };
    
    checkAvailableTimeSlots();
  }, [selectedDate, professionalId, serviceId]);
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    form.setValue("date", date);
    form.setValue("time", ""); // Reset time when date changes
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    variant={"outline"}
                    className={cn(
                      "pl-3 text-left font-normal",
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
                  onSelect={handleDateSelect}
                  disabled={(date) => 
                    date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                    date > new Date(new Date().setDate(new Date().getDate() + 60))
                  }
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
              onValueChange={field.onChange} 
              value={field.value}
              disabled={!selectedDate || loading || availableTimeSlots.length === 0}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue 
                    placeholder={
                      loading
                        ? "Verificando horários..."
                        : !selectedDate
                        ? "Selecione uma data primeiro"
                        : availableTimeSlots.length === 0
                        ? "Sem horários disponíveis"
                        : "Selecione um horário"
                    } 
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableTimeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{time}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
