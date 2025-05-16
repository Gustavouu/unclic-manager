
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TimeOff, CreateTimeOffData, UpdateTimeOffData } from '../appointments/types';

export const useTimeOff = () => {
  const [timeOffRecords, setTimeOffRecords] = useState<TimeOff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTimeOff = async (businessId: string, professionalId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('time_off')
        .select('*')
        .eq('business_id', businessId);

      if (professionalId) {
        query = query.eq('professional_id', professionalId);
      }

      const { data, error } = await query.order('start_date', { ascending: false });

      if (error) {
        throw error;
      }

      setTimeOffRecords(data || []);
    } catch (err) {
      console.error('Error fetching time off records:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch time off records'));
      toast.error('Failed to fetch time off records');
    } finally {
      setIsLoading(false);
    }
  };

  const createTimeOff = async (
    businessId: string,
    timeOffData: CreateTimeOffData
  ): Promise<TimeOff | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('time_off')
        .insert({
          business_id: businessId,
          ...timeOffData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setTimeOffRecords(prev => [data, ...prev]);
      toast.success('Time off record created successfully');
      return data;
    } catch (err) {
      console.error('Error creating time off record:', err);
      setError(err instanceof Error ? err : new Error('Failed to create time off record'));
      toast.error('Failed to create time off record');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTimeOff = async (
    id: string,
    updates: UpdateTimeOffData
  ): Promise<TimeOff | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('time_off')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setTimeOffRecords(prev => 
        prev.map(record => record.id === id ? data : record)
      );
      
      toast.success('Time off record updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating time off record:', err);
      setError(err instanceof Error ? err : new Error('Failed to update time off record'));
      toast.error('Failed to update time off record');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTimeOff = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('time_off')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTimeOffRecords(prev => prev.filter(record => record.id !== id));
      toast.success('Time off record deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting time off record:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete time off record'));
      toast.error('Failed to delete time off record');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    timeOffRecords,
    isLoading,
    error,
    fetchTimeOff,
    createTimeOff,
    updateTimeOff,
    deleteTimeOff
  };
};
