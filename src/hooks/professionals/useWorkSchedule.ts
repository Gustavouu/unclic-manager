
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfessionalSchedule } from './types';

export const useWorkSchedule = (professionalId: string) => {
  const [schedules, setSchedules] = useState<ProfessionalSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchSchedules = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('professional_id', professionalId)
        .order('day_of_week');
      
      if (error) {
        throw error;
      }
      
      setSchedules(data as ProfessionalSchedule[]);
      return data as ProfessionalSchedule[];
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch professional schedules'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const upsertSchedule = async (schedule: Partial<ProfessionalSchedule>): Promise<ProfessionalSchedule | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // If there's an ID, it's an update, otherwise it's a new schedule
      const isNewSchedule = !schedule.id;
      
      if (isNewSchedule) {
        const { data, error } = await supabase
          .from('schedules')
          .insert({
            ...schedule,
            professional_id: professionalId
          })
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        setSchedules(prev => [...prev, data as ProfessionalSchedule]);
        toast.success('Horário adicionado com sucesso');
        return data as ProfessionalSchedule;
      } else {
        const { data, error } = await supabase
          .from('schedules')
          .update(schedule)
          .eq('id', schedule.id)
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        setSchedules(prev => 
          prev.map(s => s.id === schedule.id ? data as ProfessionalSchedule : s)
        );
        toast.success('Horário atualizado com sucesso');
        return data as ProfessionalSchedule;
      }
    } catch (err) {
      console.error('Error saving schedule:', err);
      setError(err instanceof Error ? err : new Error('Failed to save professional schedule'));
      toast.error('Erro ao salvar horário');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteSchedule = async (id: string): Promise<boolean> => {
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
      
      setSchedules(prev => prev.filter(s => s.id !== id));
      toast.success('Horário removido com sucesso');
      return true;
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete professional schedule'));
      toast.error('Erro ao remover horário');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createDefaultSchedule = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const defaultSchedules = [
        { day_of_week: 0, start_time: '09:00', end_time: '17:00', is_working_day: false }, // Sunday
        { day_of_week: 1, start_time: '09:00', end_time: '17:00', is_working_day: true },  // Monday
        { day_of_week: 2, start_time: '09:00', end_time: '17:00', is_working_day: true },  // Tuesday
        { day_of_week: 3, start_time: '09:00', end_time: '17:00', is_working_day: true },  // Wednesday
        { day_of_week: 4, start_time: '09:00', end_time: '17:00', is_working_day: true },  // Thursday
        { day_of_week: 5, start_time: '09:00', end_time: '17:00', is_working_day: true },  // Friday
        { day_of_week: 6, start_time: '09:00', end_time: '13:00', is_working_day: false }, // Saturday
      ];
      
      const schedulesToInsert = defaultSchedules.map(schedule => ({
        ...schedule,
        professional_id: professionalId
      }));
      
      const { data, error } = await supabase
        .from('schedules')
        .insert(schedulesToInsert)
        .select();
      
      if (error) {
        throw error;
      }
      
      setSchedules(data as ProfessionalSchedule[]);
      toast.success('Horário padrão criado com sucesso');
      return data as ProfessionalSchedule[];
    } catch (err) {
      console.error('Error creating default schedule:', err);
      setError(err instanceof Error ? err : new Error('Failed to create default schedule'));
      toast.error('Erro ao criar horário padrão');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    schedules,
    isLoading,
    error,
    fetchSchedules,
    upsertSchedule,
    deleteSchedule,
    createDefaultSchedule
  };
};
