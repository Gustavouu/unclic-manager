import { useState, useEffect } from 'react';
import { StandardizedAppointmentService } from '@/services/appointments/standardizedAppointmentService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { UnifiedAppointment, normalizeStatus } from '@/types/appointment-unified';
import type { AppointmentCreate, AppointmentUpdate } from '@/types/appointment';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<UnifiedAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();
  const appointmentService = StandardizedAppointmentService.getInstance();

  const fetchAppointments = async () => {
    if (!businessId) {
      setAppointments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching appointments for business ID:', businessId);
      
      const data = await appointmentService.search({ business_id: businessId });
      
      // Convert to unified format
      const unifiedData: UnifiedAppointment[] = data.map((appointment) => ({
        id: appointment.id,
        business_id: appointment.business_id,
        client_id: appointment.client_id,
        client_name: appointment.client_name,
        professional_id: appointment.professional_id,
        professional_name: appointment.professional_name,
        service_id: appointment.service_id,
        service_name: appointment.service_name,
        service_type: 'general',
        date: new Date(appointment.date),
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        duration: appointment.duration,
        price: appointment.price,
        status: normalizeStatus(appointment.status),
        notes: appointment.notes,
        payment_method: appointment.payment_method,
        payment_status: 'pending',
        rating: appointment.rating,
        feedback_comment: appointment.feedback_comment,
        reminder_sent: appointment.reminder_sent,
        created_at: appointment.created_at,
        updated_at: appointment.updated_at,
        // Legacy compatibility
        clientId: appointment.client_id,
        clientName: appointment.client_name,
        serviceId: appointment.service_id,
        serviceName: appointment.service_name,
        professionalId: appointment.professional_id,
        professionalName: appointment.professional_name,
      }));
      
      setAppointments(unifiedData);
      console.log('Successfully loaded', unifiedData.length, 'appointments');
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
      business_id: businessId
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
    return await appointmentService.getByDateRange(businessId, startDate, endDate);
  };

  const getAppointmentStats = async (dateFrom?: string, dateTo?: string) => {
    if (!businessId) return null;
    return await appointmentService.getStats(businessId, dateFrom, dateTo);
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
    getAppointmentStats,
  };
};
