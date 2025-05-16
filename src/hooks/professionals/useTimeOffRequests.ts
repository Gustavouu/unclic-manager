
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTenant } from '@/contexts/TenantContext';
import { ProfessionalStatus } from './types';

export interface TimeOffRequest {
  id: string;
  professional_id: string;
  business_id: string;
  start_date: string;
  end_date: string;
  reason?: string;
  is_approved?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface TimeOffFormData {
  professional_id: string;
  start_date: string;
  end_date: string;
  reason?: string;
}

export const useTimeOffRequests = () => {
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { businessId } = useTenant();
  
  const fetchTimeOffRequests = async (professionalId?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('time_off')
        .select('*');
      
      if (professionalId) {
        query = query.eq('professional_id', professionalId);
      }
      
      if (businessId) {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setTimeOffRequests(data);
      return data;
    } catch (err) {
      console.error('Error fetching time off requests:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch time off requests'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const createTimeOff = async (timeOffData: TimeOffFormData): Promise<TimeOffRequest | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('time_off')
        .insert({
          ...timeOffData,
          business_id: businessId,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setTimeOffRequests(prev => [...prev, data]);
      toast.success('Folga registrada com sucesso');
      
      // Update the professional status if needed
      try {
        await supabase
          .from('professionals')
          .update({ status: ProfessionalStatus.ON_VACATION })
          .eq('id', timeOffData.professional_id);
      } catch (statusError) {
        console.warn('Could not update professional status:', statusError);
      }
      
      return data;
    } catch (err) {
      console.error('Error creating time off request:', err);
      setError(err instanceof Error ? err : new Error('Failed to create time off request'));
      toast.error('Erro ao registrar folga');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateTimeOff = async (id: string, updates: Partial<TimeOffFormData>): Promise<TimeOffRequest | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('time_off')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setTimeOffRequests(prev => 
        prev.map(timeOff => timeOff.id === id ? data : timeOff)
      );
      toast.success('Folga atualizada com sucesso');
      return data;
    } catch (err) {
      console.error('Error updating time off request:', err);
      setError(err instanceof Error ? err : new Error('Failed to update time off request'));
      toast.error('Erro ao atualizar folga');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const approveTimeOff = async (id: string): Promise<TimeOffRequest | null> => {
    return updateTimeOff(id, { is_approved: true });
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
      
      setTimeOffRequests(prev => prev.filter(timeOff => timeOff.id !== id));
      toast.success('Folga removida com sucesso');
      return true;
    } catch (err) {
      console.error('Error deleting time off request:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete time off request'));
      toast.error('Erro ao remover folga');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    timeOffRequests,
    isLoading,
    error,
    fetchTimeOffRequests,
    createTimeOff,
    updateTimeOff,
    approveTimeOff,
    deleteTimeOff
  };
};
