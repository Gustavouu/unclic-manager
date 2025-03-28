
import { useEffect } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { BusinessHours } from "@/contexts/onboarding/types";

export const useBusinessHours = () => {
  // Try to get business hours from the context, but don't throw an error if unavailable
  let businessHours: BusinessHours | null = null;
  
  try {
    const context = useOnboarding();
    businessHours = context.businessHours;
  } catch (error) {
    // If context is not available, use default business hours
    businessHours = {
      monday: { open: true, openTime: "08:00", closeTime: "18:00" },
      tuesday: { open: true, openTime: "08:00", closeTime: "18:00" },
      wednesday: { open: true, openTime: "08:00", closeTime: "18:00" },
      thursday: { open: true, openTime: "08:00", closeTime: "18:00" },
      friday: { open: true, openTime: "08:00", closeTime: "18:00" },
      saturday: { open: true, openTime: "08:00", closeTime: "12:00" },
      sunday: { open: false, openTime: "08:00", closeTime: "18:00" }
    };
    console.log("Using default business hours because OnboardingProvider is not available");
  }
  
  // Convert business hours to the format used by the calendar
  const getCalendarBusinessHours = (): Record<string, { isOpen: boolean; hours?: string }> => {
    const result: Record<string, { isOpen: boolean; hours?: string }> = {};
    
    // Map day names to day numbers (0=Sunday, 1=Monday, etc.)
    const dayMap: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6
    };
    
    // Convert the business hours to calendar format
    Object.entries(businessHours || {}).forEach(([day, hours]) => {
      const dayNumber = dayMap[day];
      result[dayNumber] = {
        isOpen: hours.open,
        hours: hours.open ? `${hours.openTime} - ${hours.closeTime}` : undefined
      };
    });
    
    return result;
  };
  
  // Check if a specific time is within business hours
  const isWithinBusinessHours = (date: Date): boolean => {
    if (!businessHours) return false;
    
    const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, etc.
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Map day numbers back to day names
    const dayMap: Record<number, string> = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday"
    };
    
    const dayName = dayMap[dayOfWeek];
    const dayHours = businessHours[dayName];
    
    // If the business is closed on this day, return false
    if (!dayHours.open) return false;
    
    // Get the opening and closing hours/minutes
    const [openHour, openMinute] = dayHours.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = dayHours.closeTime.split(':').map(Number);
    
    // Convert the time to minutes for easier comparison
    const timeInMinutes = hours * 60 + minutes;
    const openTimeInMinutes = openHour * 60 + openMinute;
    const closeTimeInMinutes = closeHour * 60 + closeMinute;
    
    // Check if the time is within business hours
    return timeInMinutes >= openTimeInMinutes && timeInMinutes < closeTimeInMinutes;
  };
  
  // Format business hours for display
  const formatBusinessHours = (): { day: string; hours: string }[] => {
    if (!businessHours) return [];
    
    return Object.entries(businessHours).map(([day, hours]) => {
      const formattedDay = day.charAt(0).toUpperCase() + day.slice(1);
      const formattedHours = hours.open ? `${hours.openTime} - ${hours.closeTime}` : "Fechado";
      
      return {
        day: formattedDay,
        hours: formattedHours
      };
    });
  };
  
  return {
    businessHours: businessHours || {} as BusinessHours,
    getCalendarBusinessHours,
    isWithinBusinessHours,
    formatBusinessHours
  };
};
