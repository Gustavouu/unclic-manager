
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
      // Update in Supabase
      const { error: supabaseError } = await supabase
        .from("agendamentos")
        .update({
          data: data.date?.toISOString(),
          cliente_id: data.clientId,
          cliente_nome: data.clientName,
          servico_id: data.serviceId,
          servico_nome: data.serviceName,
          tipo_servico: data.serviceType,
          profissional_id: data.professionalId,
          profissional_nome: data.professionalName,
          duracao: data.duration,
          preco: data.price,
          status: data.status,
          notas: data.notes,
          metodo_pagamento: data.paymentMethod,
          confirmado: data.confirmed,
          servicos_adicionais: data.additionalServices
        })
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
              ...(data.paymentMethod !== undefined && { paymentMethod: data.paymentMethod }),
              ...(data.confirmed !== undefined && { confirmed: data.confirmed }),
              ...(data.additionalServices && { additionalServices: data.additionalServices })
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
