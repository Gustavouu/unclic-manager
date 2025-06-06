
import { useState, useEffect } from 'react';
import { ProfessionalService } from '@/services/professional/professionalService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Professional } from '@/types/professional';

export const useProfessionalsList = () => {
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

  const refetch = () => {
    fetchProfessionals();
  };

  return {
    professionals,
    isLoading,
    error,
    refetch,
  };
};
