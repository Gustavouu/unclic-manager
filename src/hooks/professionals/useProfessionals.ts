
import { useState, useEffect } from 'react';
import { ProfessionalService } from '@/services/professional/professionalService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { Professional, ProfessionalStatus, ProfessionalFormData } from './types';

export const useProfessionals = (options?: { 
  activeOnly?: boolean, 
  withServices?: boolean 
}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();
  
  const activeOnly = options?.activeOnly ?? true;
  const professionalService = ProfessionalService.getInstance();

  // Memoize available specialties
  const specialties = Array.from(new Set(professionals.flatMap(p => p.specialties || [])));

  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!businessId) {
        setLoading(false);
        setProfessionals([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await professionalService.getByBusinessId(businessId);
        
        // Map data to match Professional interface
        const mappedData: Professional[] = data.map(item => ({
          id: item.id,
          name: item.name || '',
          email: item.email,
          phone: item.phone,
          bio: item.bio,
          photo_url: item.photo_url,
          specialties: item.specialties || [],
          status: item.status === 'active' ? ProfessionalStatus.ACTIVE : ProfessionalStatus.INACTIVE,
          business_id: businessId,
          position: item.position,
          commission_percentage: item.commission_percentage,
          hire_date: item.hire_date,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        
        // Filter by active status if requested
        const filteredData = activeOnly ? mappedData.filter(p => p.status === ProfessionalStatus.ACTIVE) : mappedData;
        
        setProfessionals(filteredData);
        
      } catch (err: any) {
        console.error('Error in useProfessionals:', err);
        setError(err.message || 'Failed to fetch professionals');
        setProfessionals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [businessId, activeOnly]);

  // CRUD operations using the service
  const createProfessional = async (data: ProfessionalFormData) => {
    if (!businessId) throw new Error('No business selected');
    
    await professionalService.create({
      ...data,
      business_id: businessId,
    });
    
    // Refresh the list
    const updatedData = await professionalService.getByBusinessId(businessId);
    const mappedData: Professional[] = updatedData.map(item => ({
      id: item.id,
      name: item.name || '',
      email: item.email,
      phone: item.phone,
      bio: item.bio,
      photo_url: item.photo_url,
      specialties: item.specialties || [],
      status: item.status === 'active' ? ProfessionalStatus.ACTIVE : ProfessionalStatus.INACTIVE,
      business_id: businessId,
      position: item.position,
      commission_percentage: item.commission_percentage,
      hire_date: item.hire_date,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
    setProfessionals(mappedData);
  };
  
  const updateProfessional = async (id: string, data: Partial<ProfessionalFormData>) => {
    await professionalService.update(id, data);
    
    // Refresh the list
    const updatedData = await professionalService.getByBusinessId(businessId!);
    const mappedData: Professional[] = updatedData.map(item => ({
      id: item.id,
      name: item.name || '',
      email: item.email,
      phone: item.phone,
      bio: item.bio,
      photo_url: item.photo_url,
      specialties: item.specialties || [],
      status: item.status === 'active' ? ProfessionalStatus.ACTIVE : ProfessionalStatus.INACTIVE,
      business_id: businessId!,
      position: item.position,
      commission_percentage: item.commission_percentage,
      hire_date: item.hire_date,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
    setProfessionals(mappedData);
  };
  
  const deleteProfessional = async (id: string) => {
    await professionalService.delete(id);
    
    // Refresh the list
    const updatedData = await professionalService.getByBusinessId(businessId!);
    const mappedData: Professional[] = updatedData.map(item => ({
      id: item.id,
      name: item.name || '',
      email: item.email,
      phone: item.phone,
      bio: item.bio,
      photo_url: item.photo_url,
      specialties: item.specialties || [],
      status: item.status === 'active' ? ProfessionalStatus.ACTIVE : ProfessionalStatus.INACTIVE,
      business_id: businessId!,
      position: item.position,
      commission_percentage: item.commission_percentage,
      hire_date: item.hire_date,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
    setProfessionals(mappedData);
  };

  return { 
    professionals, 
    loading, 
    isLoading: loading, 
    error,
    specialties,
    createProfessional,
    updateProfessional,
    deleteProfessional
  };
};
