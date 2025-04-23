
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, addMinutes, isBefore, isAfter, parse } from "date-fns";
import { useBusinessHours } from "./useBusinessHours";

export const useAvailableTimeSlots = (
  selectedDate: Date | undefined,
  professionalId: string | undefined, 
  serviceDuration: number = 60
) => {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { businessHours } = useBusinessHours();
  
  useEffect(() => {
    if (!selectedDate || !professionalId) {
      setAvailableSlots([]);
      return;
    }
    
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        // Format date for database query
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        
        // Get day of week (0-6, where 0 is Sunday)
        const dayOfWeek = selectedDate.getDay();
        const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const dayName = dayNames[dayOfWeek];
        
        // If business is closed on this day, return empty slots
        if (!businessHours[dayName]?.enabled) {
          setAvailableSlots([]);
          setIsLoading(false);
          return;
        }
        
        // Get business hours for this day
        const openTime = businessHours[dayName]?.start || "09:00";
        const closeTime = businessHours[dayName]?.end || "18:00";
        
        // Get existing appointments for this professional on this date
        const { data: appointments, error } = await supabase
          .from('agendamentos')
          .select('hora_inicio, hora_fim, duracao')
          .eq('data', dateStr)
          .eq('id_funcionario', professionalId);
          
        if (error) throw error;
        
        // Generate all possible time slots in 30-minute increments
        const slots: string[] = [];
        const startTime = parse(openTime, 'HH:mm', new Date());
        const endTime = parse(closeTime, 'HH:mm', new Date());
        
        let currentSlot = startTime;
        while (isBefore(currentSlot, endTime)) {
          const timeString = format(currentSlot, 'HH:mm');
          slots.push(timeString);
          currentSlot = addMinutes(currentSlot, 30);
        }
        
        // Filter out slots that overlap with existing appointments
        const availableTimeSlots = slots.filter(slot => {
          // Convert slot to Date object
          const [hours, minutes] = slot.split(':').map(Number);
          const slotDate = new Date(selectedDate);
          slotDate.setHours(hours, minutes, 0, 0);
          
          // Calculate end time of this appointment
          const endSlotDate = addMinutes(slotDate, serviceDuration);
          
          // Check if this slot overlaps with any existing appointment
          return !appointments?.some(appointment => {
            const [apptStartHours, apptStartMinutes] = appointment.hora_inicio.split(':').map(Number);
            const [apptEndHours, apptEndMinutes] = appointment.hora_fim.split(':').map(Number);
            
            const apptStartDate = new Date(selectedDate);
            apptStartDate.setHours(apptStartHours, apptStartMinutes, 0, 0);
            
            const apptEndDate = new Date(selectedDate);
            apptEndDate.setHours(apptEndHours, apptEndMinutes, 0, 0);
            
            // Check for overlap
            return (
              (isAfter(endSlotDate, apptStartDate) && isBefore(slotDate, apptEndDate))
            );
          });
        });
        
        setAvailableSlots(availableTimeSlots);
      } catch (error) {
        console.error('Error checking available time slots:', error);
        setAvailableSlots([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailability();
  }, [selectedDate, professionalId, serviceDuration, businessHours]);
  
  return { 
    availableSlots, 
    isLoading 
  };
};
