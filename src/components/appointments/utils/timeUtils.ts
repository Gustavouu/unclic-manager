
/**
 * Utility functions for handling time-related operations
 */

/**
 * Generate time slots between startTime and endTime with the specified interval
 * @param startTime - Start time in 24-hour format (e.g., "09:00")
 * @param endTime - End time in 24-hour format (e.g., "17:00")
 * @param intervalMinutes - Interval between slots in minutes (e.g., 30)
 * @returns Array of time slots in 24-hour format (e.g., ["09:00", "09:30", "10:00", ...])
 */
export const generateTimeSlots = (startTime: string, endTime: string, intervalMinutes: number = 30): string[] => {
  const slots: string[] = [];
  
  // Parse start and end times
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  // Convert to minutes for easier calculation
  let startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  // Generate time slots
  while (startMinutes < endMinutes) {
    const hour = Math.floor(startMinutes / 60);
    const minute = startMinutes % 60;
    
    // Format as HH:MM
    slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    
    // Move to next slot
    startMinutes += intervalMinutes;
  }
  
  return slots;
};

/**
 * Generate a list of time options for a dropdown
 */
export const generateTimeOptions = () => {
  // This is the legacy function used elsewhere
  return generateTimeSlots("09:00", "18:00", 30);
};
