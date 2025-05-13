
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import { 
  Appointment, 
  AppointmentStatus, 
  CreateAppointmentData, 
  UpdatedAppointmentData 
} from "./types";
import { useAppointmentsFetch } from "./useAppointmentsFetch";
import { useAppointmentCreate } from "./useAppointmentCreate";
import { useAppointmentUpdate } from "./useAppointmentUpdate";
import { useAppointmentDelete } from "./useAppointmentDelete";

// Export types using 'export type' syntax for module interoperability
export type { AppointmentStatus, Appointment };

export const useAppointments = () => {
  const { 
    appointments, 
    setAppointments, 
    isLoading, 
    error, 
    fetchAppointments 
  } = useAppointmentsFetch();
  
  const { createAppointment, updateAppointment, cancelAppointment, isLoading: isCreating } = useAppointmentCreate(setAppointments);
  const { updateAppointment: updateAppointmentData, isUpdating, error: updateError } = useAppointmentUpdate(setAppointments);
  const { deleteAppointment } = useAppointmentDelete(setAppointments);
  
  // Maintain backward compatibility with the existing updateAppointmentStatus method
  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    return updateAppointmentData(id, { status });
  };

  return {
    appointments,
    isLoading: isLoading || isCreating || isUpdating,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    fetchAppointments
  };
};
