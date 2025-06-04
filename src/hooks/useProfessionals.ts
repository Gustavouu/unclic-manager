
import { useState, useEffect } from 'react';
import { ProfessionalService } from '@/services/professional/professionalService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Professional, ProfessionalFormData } from '@/types/professional';

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

  const createProfessional = async (data: ProfessionalFormData) => {
    if (!businessId) throw new Error('No business selected');
    
    const newProfessional = await professionalService.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      position: data.position,
      bio: data.bio,
      photo_url: data.photo_url,
      specialties: data.specialties,
      commission_percentage: data.commission_percentage,
      hire_date: data.hire_date,
      status: data.status,
      business_id: businessId,
    });
    
    await fetchProfessionals();
    return newProfessional;
  };

  const updateProfessional = async (id: string, data: Partial<ProfessionalFormData>) => {
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
