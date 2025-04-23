
import { useMemo } from "react";
import { useBusinessHours } from "@/hooks/useBusinessHours";

export type TimeSlot = {
  time: string;
  period: "morning" | "afternoon" | "evening";
  isAvailable: boolean;
};

export type Period = "morning" | "afternoon" | "evening" | "all";

export function useTimeSlots(selectedDate?: Date) {
  const { businessHours, isWithinBusinessHours } = useBusinessHours();
  
  // Get day name from selected date
  const getDayName = (date?: Date): string | null => {
    if (!date) return null;
    
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[date.getDay()];
  };
  
  // Generate available time slots
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    const dayName = getDayName(selectedDate);
    
    // If no date selected or day name not found, return empty slots
    if (!dayName || !businessHours[dayName]) {
      return slots;
    }
    
    // Skip if business is closed on this day
    if (!businessHours[dayName].enabled) {
      return slots;
    }
    
    // Get business hours for the selected day
    const startTime = businessHours[dayName].start;
    const endTime = businessHours[dayName].end;
    
    // Parse opening and closing times
    const [openHour, openMinute] = startTime.split(':').map(Number);
    const [closeHour, closeMinute] = endTime.split(':').map(Number);
    
    // Generate slots based on business hours
    for (let hour = openHour; hour <= closeHour; hour++) {
      // Only add the first slot if we're starting from the open hour
      if (hour === openHour) {
        if (openMinute <= 0) {
          slots.push({ 
            time: `${hour.toString().padStart(2, '0')}:00`, 
            period: hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening",
            isAvailable: true
          });
        }
        if (openMinute <= 30) {
          slots.push({ 
            time: `${hour.toString().padStart(2, '0')}:30`, 
            period: hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening",
            isAvailable: true
          });
        }
      } 
      // Only add the last slot if we haven't reached the close hour
      else if (hour === closeHour) {
        if (closeMinute > 0) {
          slots.push({ 
            time: `${hour.toString().padStart(2, '0')}:00`, 
            period: hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening",
            isAvailable: true
          });
        }
        if (closeMinute > 30) {
          slots.push({ 
            time: `${hour.toString().padStart(2, '0')}:30`, 
            period: hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening",
            isAvailable: true
          });
        }
      }
      // Add both slots for hours in between
      else {
        slots.push({ 
          time: `${hour.toString().padStart(2, '0')}:00`, 
          period: hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening",
          isAvailable: true
        });
        slots.push({ 
          time: `${hour.toString().padStart(2, '0')}:30`, 
          period: hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening",
          isAvailable: true
        });
      }
    }
    
    return slots;
  }, [businessHours, selectedDate]);

  // Group time slots by period
  const morningSlots = timeSlots.filter(slot => slot.period === "morning");
  const afternoonSlots = timeSlots.filter(slot => slot.period === "afternoon");
  const eveningSlots = timeSlots.filter(slot => slot.period === "evening");

  // Check if business is open on selected date
  const isBusinessOpen = useMemo(() => {
    const dayName = getDayName(selectedDate);
    if (!dayName || !businessHours[dayName]) return false;
    return businessHours[dayName].enabled;
  }, [businessHours, selectedDate]);

  return {
    timeSlots,
    morningSlots,
    afternoonSlots,
    eveningSlots,
    isBusinessOpen
  };
}
