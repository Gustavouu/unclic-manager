
import { Professional, ProfessionalFormData } from './types';
import { supabase } from '@/integrations/supabase/client';

export async function fetchProfessionals(businessId: string): Promise<Professional[]> {
  const { data, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('business_id', businessId);

  if (error) {
    console.error('Error fetching professionals:', error);
    throw error;
  }

  return data || [];
}

export async function createProfessional(
  businessId: string, 
  professionalData: ProfessionalFormData
): Promise<Professional> {
  const { data, error } = await supabase
    .from('professionals')
    .insert([{ 
      business_id: businessId,
      ...professionalData 
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating professional:', error);
    throw error;
  }

  return data;
}

export async function updateProfessional(
  professionalId: string, 
  updates: Partial<ProfessionalFormData>
): Promise<Professional> {
  const { data, error } = await supabase
    .from('professionals')
    .update(updates)
    .eq('id', professionalId)
    .select()
    .single();

  if (error) {
    console.error('Error updating professional:', error);
    throw error;
  }

  return data;
}

export async function deleteProfessional(professionalId: string): Promise<void> {
  const { error } = await supabase
    .from('professionals')
    .delete()
    .eq('id', professionalId);

  if (error) {
    console.error('Error deleting professional:', error);
    throw error;
  }
}
