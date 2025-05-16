
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentFilters } from './types';
import { toast } from 'sonner';

export const useAppointmentsFetch = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAppointments = async (
    businessId: string,
    filters?: AppointmentFilters
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .eq('business_id', businessId);

      // Apply filters if provided
      if (filters) {
        if (filters.startDate) {
          query = query.gte('start_time', filters.startDate.toISOString());
        }
        if (filters.endDate) {
          query = query.lte('start_time', filters.endDate.toISOString());
        }
        if (filters.professionalId) {
          query = query.eq('professional_id', filters.professionalId);
        }
        if (filters.clientId) {
          query = query.eq('client_id', filters.clientId);
        }
        if (filters.serviceId) {
          query = query.eq('service_id', filters.serviceId);
        }
        if (filters.status) {
          if (Array.isArray(filters.status)) {
            query = query.in('status', filters.status);
          } else {
            query = query.eq('status', filters.status);
          }
        }
      }

      const { data, error } = await query.order('start_time', { ascending: true });

      if (error) {
        throw error;
      }

      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch appointments'));
      toast.error('Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    appointments,
    setAppointments,
    isLoading,
    error,
    fetchAppointments
  };
};
