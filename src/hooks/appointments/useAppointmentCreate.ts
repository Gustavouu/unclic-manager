// Modified to only fix the error with AppointmentStatus
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
// Import AppointmentStatus enum that we added to professionals/types.ts
import { AppointmentStatus, APPOINTMENT_STATUS_RECORD } from "@/hooks/professionals/types";

export const useAppointmentCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { tenantId } = useTenant();

  const createAppointment = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("appointments")
        .insert([
          {
            ...formData,
            tenant_id: tenantId,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Agendamento criado!",
        description: "Seu agendamento foi criado com sucesso.",
      });
      return data;
    } catch (error) {
      setError(error);
      toast({
        title: "Erro ao criar agendamento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointment = async (id, formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("appointments")
        .update({
          ...formData,
        })
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Agendamento atualizado!",
        description: "Seu agendamento foi atualizado com sucesso.",
      });
      return data;
    } catch (error) {
      setError(error);
      toast({
        title: "Erro ao atualizar agendamento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    setIsLoading(true);
    setError(null);
    
    // Use the proper status record with updated type
    const statusMapping = {
      ...APPOINTMENT_STATUS_RECORD,
      [AppointmentStatus.SCHEDULED]: "scheduled" // This fixes the TypeScript error
    };

    try {
      const { data, error } = await supabase
        .from("appointments")
        .update({
          status: statusMapping[AppointmentStatus.CANCELLED],
        })
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Agendamento cancelado!",
        description: "Seu agendamento foi cancelado com sucesso.",
      });
      return data;
    } catch (error) {
      setError(error);
      toast({
        title: "Erro ao cancelar agendamento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rescheduleAppointment = async (id, newDate, newStartTime) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("appointments")
        .update({
          date: newDate,
          start_time: newStartTime,
        })
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Agendamento reagendado!",
        description: "Seu agendamento foi reagendado com sucesso.",
      });
      return data;
    } catch (error) {
      setError(error);
      toast({
        title: "Erro ao reagendar agendamento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createAppointment,
    updateAppointment,
    cancelAppointment,
    rescheduleAppointment,
    isLoading,
    error,
  };
};
