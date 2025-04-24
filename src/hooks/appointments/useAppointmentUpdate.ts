
import { useState } from "react";
import { Appointment } from "../../components/appointments/types";

interface UpdatedAppointmentData {
  date?: Date;
  status?: string;
  [key: string]: any;
}

export function useAppointmentUpdate(setAppointments?: React.Dispatch<React.SetStateAction<Appointment[]>>) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateAppointment = async (id: string, data: UpdatedAppointmentData): Promise<boolean> => {
    try {
      setIsUpdating(true);
      
      // In a real implementation, this would call an API endpoint
      console.log(`Updating appointment ${id} with data:`, data);
      
      // Update local state if setAppointments callback is provided
      if (setAppointments) {
        setAppointments(prevAppointments => 
          prevAppointments.map(appointment => 
            appointment.id === id 
              ? { ...appointment, ...data } 
              : appointment
          )
        );
      }
      
      return true;
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateAppointment,
    isUpdating,
    error
  };
}
