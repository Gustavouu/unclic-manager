import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { format, parse, addMinutes } from 'date-fns';
import { generateTimeOptions } from '../utils/timeUtils';
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { safeJsonObject } from '@/utils/databaseUtils';

export type DateTimeSelectWrapperProps = {
  form: UseFormReturn<AppointmentFormValues>;
  serviceId?: string;
  professionalId?: string;
};

// Helper function added to support safe JSON parsing to object
export const safeJsonObject = (jsonData: any, defaultValue: Record<string, any> = {}): Record<string, any> => {
  try {
    if (!jsonData) return defaultValue;
    
    if (typeof jsonData === 'object' && jsonData !== null) {
      return jsonData;
    }
    
    if (typeof jsonData === 'string') {
      try {
        return JSON.parse(jsonData);
      } catch (e) {
        return defaultValue;
      }
    }
    
    return defaultValue;
  } catch (e) {
    console.error('Error parsing JSON to object:', e);
    return defaultValue;
  }
};

type BusinessHours = {
  [key: string]: {
    start: string;
    end: string;
  };
};

const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  '1': { start: '09:00', end: '17:00' },
  '2': { start: '09:00', end: '17:00' },
  '3': { start: '09:00', end: '17:00' },
  '4': { start: '09:00', end: '17:00' },
  '5': { start: '09:00', end: '17:00' },
  '6': { start: '09:00', end: '17:00' },
  '0': { start: '00:00', end: '00:00' }, // Sunday closed
};

export default function DateTimeSelectWrapper({ 
  form, 
  serviceId, 
  professionalId 
}: DateTimeSelectWrapperProps) {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours>(DEFAULT_BUSINESS_HOURS);
  
  // Fetch business settings (including hours)
  useEffect(() => {
    const fetchBusinessSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('business_settings')
          .select('notes')
          .single();
        
        if (error) throw error;
        
        if (data && data.notes) {
          // Parse the notes field safely
          const notesObj = safeJsonObject(data.notes, {});
          
          // Handle different property paths that might exist
          let hours = DEFAULT_BUSINESS_HOURS;
          
          if ('business_hours' in notesObj && typeof notesObj.business_hours === 'object') {
            hours = notesObj.business_hours as BusinessHours;
          } else if ('webhook_config' in notesObj && 
                     typeof notesObj.webhook_config === 'object' && 
                     notesObj.webhook_config !== null &&
                     'business_hours' in notesObj.webhook_config) {
            hours = notesObj.webhook_config.business_hours as BusinessHours;
          }
          
          setBusinessHours(hours);
        }
      } catch (error) {
        console.error('Error fetching business settings:', error);
      }
    };
    
    fetchBusinessSettings();
  }, []);
  
  // Generate available time slots based on selected date
  useEffect(() => {
    const date = form.watch('date');
    const selectedServiceId = serviceId || form.watch('serviceId');
    const selectedProfessionalId = professionalId || form.watch('professionalId');
    
    if (!date || !selectedServiceId) {
      setAvailableTimeSlots([]);
      return;
    }
    
    const dayOfWeek = date.getDay().toString();
    const dayHours = businessHours[dayOfWeek] || DEFAULT_BUSINESS_HOURS[dayOfWeek];
    
    // If business is closed on this day
    if (!dayHours || (dayHours.start === '00:00' && dayHours.end === '00:00')) {
      setAvailableTimeSlots([]);
      return;
    }
    
    // Generate time slots based on business hours
    const slots = generateTimeOptions();
    setAvailableTimeSlots(slots);
    
    // Reset time if not in available slots
    const currentTime = form.watch('time');
    if (currentTime && !slots.includes(currentTime)) {
      form.setValue('time', '');
    }
    
    // TODO: Filter out already booked slots when we have professional and service
    if (selectedProfessionalId) {
      // In the future, we could filter out already booked slots here
    }
  }, [form.watch('date'), serviceId, professionalId, form, businessHours]);
  
  const handleTimeSelect = (time: string) => {
    form.setValue('time', time);
    
    // Calculate end time based on service duration
    const selectedServiceId = serviceId || form.watch('serviceId');
    // For now, assuming 30 minutes as default duration
    const duration = 30; 
    
    // TODO: Fetch actual service duration when we have the serviceId
    if (selectedServiceId) {
      // Here we would fetch the service duration
    }
    
    const timeObj = parse(time, 'HH:mm', new Date());
    const endTimeObj = addMinutes(timeObj, duration);
    const endTime = format(endTimeObj, 'HH:mm');
    
    // Store the end time in a field object - separate from form
    const endTimeField = { endTime };
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Date Field */}
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
                      format(field.value, "dd/MM/yyyy")
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
                    // Reset time when date changes
                    form.setValue('time', '');
                  }}
                  disabled={(date) => {
                    // Disable dates in the past
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    return date < now;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Time Field */}
      <FormField
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Horário</FormLabel>
            <FormControl>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={field.value === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTimeSelect(time)}
                      className="text-xs"
                      disabled={!form.watch('date')}
                    >
                      {time}
                    </Button>
                  ))
                ) : form.watch('date') ? (
                  <p className="text-sm text-muted-foreground col-span-full">
                    Não há horários disponíveis para esta data.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground col-span-full">
                    Selecione uma data primeiro.
                  </p>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
