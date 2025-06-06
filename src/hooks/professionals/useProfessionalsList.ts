
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Professional } from '@/types/professional';

export const useProfessionalsList = () => {
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
      console.log('Fetching professionals for business:', businessId);
      
      // Use the correct professionals table from Supabase schema
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('professionals')
        .select('*')
        .eq('business_id', businessId)
        .order('createdAt', { ascending: false });

      if (professionalsError) {
        console.log('Error from professionals table:', professionalsError);
        throw professionalsError;
      }

      console.log('Fetched professionals:', professionalsData);
      
      // Map the data to match our Professional interface
      const mappedProfessionals = (professionalsData || []).map(item => ({
        id: item.id,
        business_id: item.business_id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        bio: item.bio,
        photo_url: item.avatar,
        status: item.status,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      }));
      
      setProfessionals(mappedProfessionals);
    } catch (err) {
      console.error('Error fetching professionals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch professionals');
      setProfessionals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [businessId]);

  const searchProfessionals = async (searchTerm: string): Promise<Professional[]> => {
    if (!businessId || !searchTerm.trim()) {
      return professionals;
    }

    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('business_id', businessId)
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('createdAt', { ascending: false });

      if (error) {
        throw error;
      }

      // Map the data to match our Professional interface
      const mappedProfessionals = (data || []).map(item => ({
        id: item.id,
        business_id: item.business_id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        bio: item.bio,
        photo_url: item.avatar,
        status: item.status,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      }));

      return mappedProfessionals;
    } catch (error) {
      console.error('Error searching professionals:', error);
      return [];
    }
  };

  return {
    professionals,
    isLoading,
    error,
    refetch: fetchProfessionals,
    searchProfessionals,
  };
};
