
import { useEffect, useState } from "react";
import { useAppointmentsFetch } from "./useAppointmentsFetch";
import { useAppointmentCreate } from "./useAppointmentCreate";
import { useAppointmentUpdate } from "./useAppointmentUpdate";
import { useAppointmentDelete } from "./useAppointmentDelete";
import { AppointmentHookReturn, Appointment } from "./types";

export function useAppointments(): AppointmentHookReturn {
  const { 
    appointments, 
    setAppointments, 
    isLoading, 
    error, 
    fetchAppointments 
  } = useAppointmentsFetch();
  
  const { createAppointment } = useAppointmentCreate(setAppointments);
  const { updateAppointment } = useAppointmentUpdate(setAppointments);
  const { deleteAppointment } = useAppointmentDelete(setAppointments);

  // Load appointments on component mount
  useEffect(() => {
    console.log("Initial fetch of appointments in useAppointments");
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    isLoading,
    error: error ? new Error(error) : null, // Correctly cast string to Error or null
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
  };
}
