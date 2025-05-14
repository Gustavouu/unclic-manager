
// Modified to fix the errors
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
// Import AppointmentStatus constants from professionals/types.ts
import { APPOINTMENT_STATUS } from "@/hooks/professionals/types";

export const useAppointmentCreate = (setAppointments: any = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentBusiness } = useTenant();
  const tenantId = currentBusiness?.id;

  const createAppointment = async (formData: any) => {
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

      toast.success("Seu agendamento foi criado com sucesso.");
      
      // Update the appointments list if setAppointments was provided
      if (setAppointments && Array.isArray(data)) {
        setAppointments((prev: any) => [...prev, ...data]);
      }
      
      return data;
    } catch (error: any) {
      setError(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointment = async (id: string, formData: any) => {
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

      toast.success("Seu agendamento foi atualizado com sucesso.");
      
      // Update the appointments list if setAppointments was provided
      if (setAppointments && Array.isArray(data) && data.length > 0) {
        setAppointments((prev: any) => 
          prev.map((item: any) => item.id === id ? data[0] : item)
        );
      }
      
      return data;
    } catch (error: any) {
      setError(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("appointments")
        .update({
          status: APPOINTMENT_STATUS.CANCELLED,
        })
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      toast.success("Seu agendamento foi cancelado com sucesso.");
      
      // Update the appointments list if setAppointments was provided
      if (setAppointments && Array.isArray(data) && data.length > 0) {
        setAppointments((prev: any) => 
          prev.map((item: any) => item.id === id ? data[0] : item)
        );
      }
      
      return data;
    } catch (error: any) {
      setError(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const rescheduleAppointment = async (id: string, newDate: any, newStartTime: any) => {
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

      toast.success("Seu agendamento foi reagendado com sucesso.");
      
      // Update the appointments list if setAppointments was provided
      if (setAppointments && Array.isArray(data) && data.length > 0) {
        setAppointments((prev: any) => 
          prev.map((item: any) => item.id === id ? data[0] : item)
        );
      }
      
      return data;
    } catch (error: any) {
      setError(error);
      toast.error(error.message);
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
