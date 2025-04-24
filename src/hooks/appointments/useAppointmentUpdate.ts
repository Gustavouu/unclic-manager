
import { useState } from "react";
import { Appointment, AppointmentStatus } from "../../components/appointments/types";

interface UpdatedAppointmentData {
  date?: Date;
  status?: AppointmentStatus;
  [key: string]: any;
}

export function useAppointmentUpdate(setAppointments?: React.Dispatch<React.SetStateAction<Appointment[]>>) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateAppointment = async (id: string, data: UpdatedAppointmentData): Promise<void> => {
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
      
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
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
