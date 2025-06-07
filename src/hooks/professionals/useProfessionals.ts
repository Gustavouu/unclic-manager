
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { Professional, ProfessionalStatus } from '@/hooks/professionals/types';

// Re-export the Professional interface for external use
export type { Professional };

export interface ProfessionalLegacy {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  rating?: number;
  total_reviews?: number;
  status: string;
  working_hours?: any;
  business_id: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  const fetchProfessionals = async () => {
    if (!businessId) {
      setProfessionals([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching professionals for business ID:', businessId);
      
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('business_id', businessId)
        .eq('isActive', true)
        .order('name', { ascending: true });
      
      if (error) {
        console.error("Error fetching professionals:", error);
        throw error;
      }
      
      // Transform the data to match our Professional type
      const transformedData: Professional[] = (data || []).map(item => {
        // Safely parse working_hours
        let workingHours: { [day: string]: { start: string; end: string; isAvailable: boolean } } = {};
        
        if (item.working_hours && typeof item.working_hours === 'object') {
          if (Array.isArray(item.working_hours)) {
            // Handle array case - convert to object or use default
            workingHours = {};
          } else {
            // Handle object case - ensure it matches our type
            const whObject = item.working_hours as { [key: string]: any };
            Object.keys(whObject).forEach(day => {
              const dayData = whObject[day];
              if (dayData && typeof dayData === 'object' && 'start' in dayData && 'end' in dayData) {
                workingHours[day] = {
                  start: String(dayData.start || '09:00'),
                  end: String(dayData.end || '18:00'),
                  isAvailable: Boolean(dayData.isAvailable !== false)
                };
              }
            });
          }
        }

        return {
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          position: undefined,
          photo_url: item.avatar_url,
          bio: item.bio,
          specialties: undefined,
          status: ProfessionalStatus.ACTIVE,
          business_id: item.business_id,
          user_id: item.userId,
          commission_percentage: undefined,
          hire_date: undefined,
          working_hours: workingHours,
          created_at: item.createdAt,
          updated_at: item.updatedAt,
        };
      });
      
      setProfessionals(transformedData);
      console.log(`Successfully loaded ${transformedData.length} professionals`);
    } catch (err) {
      console.error("Error in fetchProfessionals:", err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar profissionais';
      setError(errorMessage);
      setProfessionals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [businessId]);

  const createProfessional = async (professionalData: Omit<Professional, 'id' | 'created_at' | 'updated_at' | 'business_id'>) => {
    if (!businessId) throw new Error('No business selected');
    
    const { data, error } = await supabase
      .from('professionals')
      .insert({
        id: crypto.randomUUID(),
        name: professionalData.name,
        email: professionalData.email,
        phone: professionalData.phone,
        avatar_url: professionalData.photo_url,
        bio: professionalData.bio,
        business_id: businessId,
        tenantId: businessId,
        establishmentId: businessId,
        isActive: true,
        status: 'active',
        working_hours: professionalData.working_hours || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    await fetchProfessionals();
    return data;
  };

  const updateProfessional = async (id: string, professionalData: Partial<Professional>) => {
    const updateData: any = {
      name: professionalData.name,
      email: professionalData.email,
      phone: professionalData.phone,
      avatar_url: professionalData.photo_url,
      bio: professionalData.bio,
      working_hours: professionalData.working_hours,
      updatedAt: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('professionals')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    
    await fetchProfessionals();
  };

  const deleteProfessional = async (id: string) => {
    const { error } = await supabase
      .from('professionals')
      .update({ isActive: false })
      .eq('id', id);

    if (error) throw error;
    
    await fetchProfessionals();
  };

  return {
    professionals,
    isLoading,
    error,
    refetch: fetchProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional,
  };
};
