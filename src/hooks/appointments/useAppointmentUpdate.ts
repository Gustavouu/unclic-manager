
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentStatus, UpdatedAppointmentData } from "./types";
import { toast } from "sonner";

export function useAppointmentUpdate(
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateAppointment = async (id: string, data: UpdatedAppointmentData): Promise<void> => {
    setIsUpdating(true);
    setError(null);

    try {
      // Use the bookings table which exists in the database
      const updateData: any = {};
      
      if (data.date) updateData.booking_date = data.date.toISOString().split('T')[0];
      if (data.clientId) updateData.client_id = data.clientId;
      if (data.serviceId) updateData.service_id = data.serviceId;
      if (data.professionalId) updateData.employee_id = data.professionalId;
      if (data.duration !== undefined) updateData.duration = data.duration;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.status) updateData.status = mapStatusToDb(data.status);
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.paymentMethod !== undefined) updateData.payment_method = data.paymentMethod;
      if (data.time) updateData.start_time = data.time;
      
      updateData.updated_at = new Date().toISOString();

      const { error: supabaseError } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", id);

      if (supabaseError) throw supabaseError;

      // Update local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) => {
          if (appointment.id === id) {
            return {
              ...appointment,
              ...(data.date && { date: data.date }),
              ...(data.clientName && { clientName: data.clientName }),
              ...(data.clientId && { clientId: data.clientId }),
              ...(data.serviceId && { serviceId: data.serviceId }),
              ...(data.serviceName && { serviceName: data.serviceName }),
              ...(data.serviceType && { serviceType: data.serviceType }),
              ...(data.professionalId && { professionalId: data.professionalId }),
              ...(data.professionalName && { professionalName: data.professionalName }),
              ...(data.duration !== undefined && { duration: data.duration }),
              ...(data.price !== undefined && { price: data.price }),
              ...(data.status && { status: data.status as AppointmentStatus }),
              ...(data.notes !== undefined && { notes: data.notes }),
              ...(data.paymentMethod !== undefined && { paymentMethod: data.paymentMethod })
            };
          }
          return appointment;
        })
      );

      toast.success("Agendamento atualizado com sucesso!");
    } catch (err) {
      const error = err as Error;
      console.error("Error updating appointment:", error);
      setError(error);
      toast.error(`Erro ao atualizar agendamento: ${error.message}`);
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

function mapStatusToDb(status: string): string {
  const statusMap: Record<string, string> = {
    'agendado': 'scheduled',
    'confirmado': 'confirmed',
    'concluido': 'completed',
    'cancelado': 'canceled',
    'scheduled': 'scheduled',
    'confirmed': 'confirmed',
    'completed': 'completed',
    'canceled': 'canceled',
  };
  return statusMap[status] || 'scheduled';
}
