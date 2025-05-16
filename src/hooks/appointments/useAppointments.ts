
import { Appointment, AppointmentStatus, CreateAppointmentData, UpdatedAppointmentData, AppointmentFilters } from './types';
import { useAppointmentsFetch } from './useAppointmentsFetch';
import { useAppointmentCreate } from './useAppointmentCreate';
import { useAppointmentUpdate } from './useAppointmentUpdate';
import { useAppointmentDelete } from './useAppointmentDelete';

// Export types using 'export type' syntax for module interoperability
export type { 
  Appointment, 
  AppointmentStatus, 
  CreateAppointmentData, 
  UpdatedAppointmentData, 
  AppointmentFilters 
};

export const useAppointments = () => {
  const { 
    appointments, 
    setAppointments, 
    isLoading: isFetching, 
    error: fetchError, 
    fetchAppointments 
  } = useAppointmentsFetch();
  
  const { 
    createAppointment, 
    updateAppointment: updateAppointmentData, 
    cancelAppointment, 
    isLoading: isCreating 
  } = useAppointmentCreate(setAppointments);
  
  const { 
    updateAppointment, 
    isUpdating 
  } = useAppointmentUpdate(setAppointments);
  
  const { 
    deleteAppointment, 
    isDeleting 
  } = useAppointmentDelete(setAppointments);
  
  // Maintain backward compatibility with the existing updateAppointmentStatus method
  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    return updateAppointment(id, { status });
  };

  return {
    appointments,
    isLoading: isFetching || isCreating || isUpdating || isDeleting,
    error: fetchError,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    deleteAppointment,
    fetchAppointments
  };
};
