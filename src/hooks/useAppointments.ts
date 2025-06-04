
import { useState, useEffect } from 'react';
import { AppointmentService } from '@/services/appointments/appointmentService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Appointment, AppointmentCreate, AppointmentUpdate } from '@/types/appointment';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  const appointmentService = AppointmentService.getInstance();

  const fetchAppointments = async () => {
    if (!businessId) {
      setAppointments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await appointmentService.search({ business_id: businessId });
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [businessId]);

  const createAppointment = async (data: Omit<AppointmentCreate, 'business_id'>) => {
    if (!businessId) throw new Error('No business selected');
    
    const newAppointment = await appointmentService.create({
      ...data,
      business_id: businessId,
    });
    
    await fetchAppointments();
    return newAppointment;
  };

  const updateAppointment = async (id: string, data: AppointmentUpdate) => {
    await appointmentService.update(id, data);
    await fetchAppointments();
  };

  const deleteAppointment = async (id: string) => {
    await appointmentService.delete(id);
    await fetchAppointments();
  };

  const getAppointmentsByDateRange = async (startDate: string, endDate: string) => {
    if (!businessId) return [];
    return appointmentService.getByDateRange(businessId, startDate, endDate);
  };

  return {
    appointments,
    isLoading,
    error,
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDateRange,
  };
};
