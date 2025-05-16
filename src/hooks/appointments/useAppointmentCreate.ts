
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Appointment, CreateAppointmentData, AppointmentStatus } from './types';
import { toast } from 'sonner';

export const useAppointmentCreate = (setAppointments: (appointments: Appointment[]) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createAppointment = async (
    businessId: string,
    appointmentData: CreateAppointmentData
  ): Promise<Appointment | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          business_id: businessId,
          ...appointmentData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setAppointments(prev => [...prev, data]);
      toast.success('Appointment created successfully');
      return data;
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err instanceof Error ? err : new Error('Failed to create appointment'));
      toast.error('Failed to create appointment');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointment = async (
    id: string,
    updates: Partial<CreateAppointmentData>
  ): Promise<Appointment | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({
          ...updates,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id ? data : appointment
        )
      );
      
      toast.success('Appointment updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError(err instanceof Error ? err : new Error('Failed to update appointment'));
      toast.error('Failed to update appointment');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (id: string): Promise<boolean> => {
    return updateAppointment(id, { status: 'cancelled' as AppointmentStatus })
      .then(result => !!result)
      .catch(() => false);
  };

  return { 
    createAppointment, 
    updateAppointment, 
    cancelAppointment, 
    isLoading, 
    error 
  };
};
