
import { format } from "date-fns";
import { Appointment } from "@/components/appointments/types";

// Helper function to safely parse date and time from appointment
export function parseDateFromAppointment(app: Appointment): { date: string; time: string } {
  let dateStr = '';
  let timeStr = '';
  
  if (app.date instanceof Date) {
    // If it's a Date object, format it appropriately
    dateStr = format(app.date, 'yyyy-MM-dd');
    timeStr = format(app.date, 'HH:mm');
  } else if (typeof app.date === 'string') {
    // If it's a string, parse it safely
    // Type assertion to tell TypeScript that app.date is definitely a string here
    const dateString = app.date as string;
    const dateParts = dateString.split('T');
    
    if (dateParts && dateParts.length > 0) {
      dateStr = dateParts[0];
      
      if (dateParts.length > 1) {
        // Extract time from second part (if available)
        timeStr = dateParts[1].substring(0, 5);
      }
    }
  }
  
  return { date: dateStr, time: timeStr };
}
