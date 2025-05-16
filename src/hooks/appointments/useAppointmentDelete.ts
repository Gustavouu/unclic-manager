
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from './types';
import { toast } from 'sonner';

export const useAppointmentDelete = (setAppointments: (appointments: Appointment[]) => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteAppointment = async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      toast.success('Appointment deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete appointment'));
      toast.error('Failed to delete appointment');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteAppointment,
    isDeleting,
    error
  };
};
