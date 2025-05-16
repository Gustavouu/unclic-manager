
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Appointment, UpdatedAppointmentData } from './types';
import { toast } from 'sonner';

export const useAppointmentUpdate = (setAppointments: (appointments: Appointment[]) => void) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateAppointment = async (
    id: string,
    updates: UpdatedAppointmentData
  ): Promise<Appointment | null> => {
    setIsUpdating(true);
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
      setIsUpdating(false);
    }
  };

  return {
    updateAppointment,
    isUpdating,
    error
  };
};
