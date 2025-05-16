
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

export interface WorkSchedule {
  id: string;
  professional_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string;
  end_time: string;
  is_working_day: boolean;
}

export interface WorkScheduleFormData {
  professional_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_working_day: boolean;
}

export const useWorkSchedule = () => {
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { businessId } = useTenant();
  
  const fetchWorkSchedule = async (professionalId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('professional_id', professionalId);
      
      if (error) {
        throw error;
      }
      
      setSchedules(data);
      return data;
    } catch (err) {
      console.error('Error fetching work schedule:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch work schedule'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const createWorkSchedule = async (scheduleData: WorkScheduleFormData): Promise<WorkSchedule | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('schedules')
        .insert(scheduleData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setSchedules(prev => [...prev, data]);
      toast.success('Horário registrado com sucesso');
      return data;
    } catch (err) {
      console.error('Error creating work schedule:', err);
      setError(err instanceof Error ? err : new Error('Failed to create work schedule'));
      toast.error('Erro ao registrar horário');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateWorkSchedule = async (id: string, updates: Partial<WorkScheduleFormData>): Promise<WorkSchedule | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setSchedules(prev => 
        prev.map(schedule => schedule.id === id ? data : schedule)
      );
      toast.success('Horário atualizado com sucesso');
      return data;
    } catch (err) {
      console.error('Error updating work schedule:', err);
      setError(err instanceof Error ? err : new Error('Failed to update work schedule'));
      toast.error('Erro ao atualizar horário');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteWorkSchedule = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
      toast.success('Horário removido com sucesso');
      return true;
    } catch (err) {
      console.error('Error deleting work schedule:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete work schedule'));
      toast.error('Erro ao remover horário');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createDefaultWeekSchedule = async (professionalId: string, startTime: string = "09:00", endTime: string = "18:00"): Promise<WorkSchedule[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Default work days are Monday through Friday (1-5)
      const workDays = [
        { day_of_week: 0, start_time: startTime, end_time: endTime, is_working_day: false }, // Sunday
        { day_of_week: 1, start_time: startTime, end_time: endTime, is_working_day: true },  // Monday
        { day_of_week: 2, start_time: startTime, end_time: endTime, is_working_day: true },  // Tuesday
        { day_of_week: 3, start_time: startTime, end_time: endTime, is_working_day: true },  // Wednesday
        { day_of_week: 4, start_time: startTime, end_time: endTime, is_working_day: true },  // Thursday
        { day_of_week: 5, start_time: startTime, end_time: endTime, is_working_day: true },  // Friday
        { day_of_week: 6, start_time: startTime, end_time: endTime, is_working_day: false }, // Saturday
      ];
      
      const scheduleDataArray = workDays.map(day => ({
        professional_id: professionalId,
        day_of_week: day.day_of_week,
        start_time: day.start_time,
        end_time: day.end_time,
        is_working_day: day.is_working_day
      }));
      
      const { data, error } = await supabase
        .from('schedules')
        .insert(scheduleDataArray)
        .select();
      
      if (error) {
        throw error;
      }
      
      setSchedules(prev => [...prev, ...data]);
      toast.success('Horário padrão criado com sucesso');
      return data;
    } catch (err) {
      console.error('Error creating default schedule:', err);
      setError(err instanceof Error ? err : new Error('Failed to create default schedule'));
      toast.error('Erro ao criar horário padrão');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    schedules,
    isLoading,
    error,
    fetchWorkSchedule,
    createWorkSchedule,
    updateWorkSchedule,
    deleteWorkSchedule,
    createDefaultWeekSchedule
  };
};
