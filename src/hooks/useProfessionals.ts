
import { useState, useEffect } from 'react';
import { ProfessionalService } from '@/services/professional/professionalService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Professional } from '@/types/professional';

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  const professionalService = ProfessionalService.getInstance();

  const fetchProfessionals = async () => {
    if (!businessId) {
      setProfessionals([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await professionalService.getByBusinessId(businessId);
      setProfessionals(data);
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

  const createProfessional = async (data: Omit<Professional, 'id' | 'business_id' | 'created_at' | 'updated_at' | 'rating' | 'total_reviews'>) => {
    if (!businessId) throw new Error('No business selected');
    
    const newProfessional = await professionalService.create({
      ...data,
      business_id: businessId,
    });
    
    await fetchProfessionals();
    return newProfessional;
  };

  const updateProfessional = async (id: string, data: Partial<Professional>) => {
    await professionalService.update(id, data);
    await fetchProfessionals();
  };

  const deleteProfessional = async (id: string) => {
    await professionalService.delete(id);
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
