
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { UnifiedAppointment } from '@/types/appointment-unified';
import type { AppointmentCreate, AppointmentUpdate } from '@/types/appointment';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<UnifiedAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

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
      
      // Use the bookings table with proper joins
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          clients!inner(name, email, phone),
          employees!inner(name, email, phone)
        `)
        .eq('business_id', businessId)
        .order('booking_date', { ascending: false })
        .order('start_time', { ascending: false });
          
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No appointment data found');
        setAppointments([]);
        return;
      }
      
      // Convert database response to UnifiedAppointment format
      const unifiedData: UnifiedAppointment[] = data.map((booking: any) => ({
        id: booking.id,
        business_id: booking.business_id,
        client_id: booking.client_id,
        client_name: booking.clients?.name || 'Cliente',
        professional_id: booking.employee_id,
        professional_name: booking.employees?.name || 'Profissional',
        service_id: booking.service_id,
        service_name: 'Serviço', // Default since we don't have services table yet
        date: new Date(booking.booking_date),
        start_time: booking.start_time,
        end_time: booking.end_time,
        duration: booking.duration,
        price: booking.price,
        status: booking.status,
        notes: booking.notes,
        payment_method: booking.payment_method,
        payment_status: 'pending', // Default value
        rating: booking.rating,
        feedback_comment: booking.feedback_comment,
        reminder_sent: booking.reminder_sent,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
        // Legacy compatibility
        clientId: booking.client_id,
        clientName: booking.clients?.name || 'Cliente',
        serviceId: booking.service_id,
        serviceName: 'Serviço',
        professionalId: booking.employee_id,
        professionalName: booking.employees?.name || 'Profissional'
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
    
    const { data: newBooking, error } = await supabase
      .from('bookings')
      .insert({
        business_id: businessId,
        client_id: data.client_id,
        employee_id: data.professional_id,
        service_id: data.service_id,
        booking_date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        duration: data.duration,
        price: data.price,
        status: data.status || 'scheduled',
        notes: data.notes,
        payment_method: data.payment_method
      })
      .select()
      .single();

    if (error) throw error;
    
    await fetchAppointments();
    return newBooking;
  };

  const updateAppointment = async (id: string, data: AppointmentUpdate) => {
    const { error } = await supabase
      .from('bookings')
      .update({
        status: data.status,
        notes: data.notes,
        payment_method: data.payment_method,
        rating: data.rating,
        feedback_comment: data.feedback_comment,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    await fetchAppointments();
  };

  const deleteAppointment = async (id: string) => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchAppointments();
  };

  const getAppointmentsByDateRange = async (startDate: string, endDate: string) => {
    if (!businessId) return [];
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('business_id', businessId)
      .gte('booking_date', startDate)
      .lte('booking_date', endDate);

    if (error) throw error;
    return data || [];
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
