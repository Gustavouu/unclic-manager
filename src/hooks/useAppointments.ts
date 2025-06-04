
import { useState, useEffect } from 'react';
import { AppointmentService } from '@/services/appointments/appointmentService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { UnifiedAppointment } from '@/types/appointment-unified';
import type { AppointmentCreate, AppointmentUpdate } from '@/types/appointment';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<UnifiedAppointment[]>([]);
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
      
      // Convert to unified format
      const unifiedData: UnifiedAppointment[] = data.map(apt => ({
        id: apt.id,
        business_id: apt.business_id,
        client_id: apt.client_id,
        client_name: apt.client_name,
        professional_id: apt.professional_id,
        professional_name: apt.professional_name,
        service_id: apt.service_id,
        service_name: apt.service_name,
        date: new Date(apt.date),
        start_time: apt.start_time,
        end_time: apt.end_time,
        duration: apt.duration,
        price: apt.price,
        status: apt.status,
        notes: apt.notes,
        payment_method: apt.payment_method,
        payment_status: apt.payment_status,
        rating: apt.rating,
        feedback_comment: apt.feedback_comment,
        reminder_sent: apt.reminder_sent,
        created_at: apt.created_at,
        updated_at: apt.updated_at,
        // Legacy compatibility
        clientId: apt.client_id,
        clientName: apt.client_name,
        serviceId: apt.service_id,
        serviceName: apt.service_name,
        professionalId: apt.professional_id,
        professionalName: apt.professional_name
      }));
      
      setAppointments(unifiedData);
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
