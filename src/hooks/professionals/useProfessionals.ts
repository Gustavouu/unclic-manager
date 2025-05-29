
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  photo_url?: string;
  bio?: string;
  specialties?: string[];
  status?: string;
  business_id?: string;
  user_id?: string;
  commission_percentage?: number;
  hire_date?: string;
  working_hours?: any;
  created_at?: string;
  updated_at?: string;
}

export enum ProfessionalStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'vacation',
  PENDING = 'pending'
}

export const useProfessionals = (options?: { 
  activeOnly?: boolean, 
  withServices?: boolean 
}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();
  
  const activeOnly = options?.activeOnly ?? true;
  const withServices = options?.withServices ?? false;

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
        
        // Try funcionarios table (legacy schema) with correct columns
        const { data, error } = await supabase
          .from('funcionarios')
          .select('id, nome, cargo, foto_url, comissao_percentual, status')
          .eq('id_negocio', businessId);
          
        if (!error && data) {
          const mappedData: Professional[] = data.map(item => ({
            id: item.id,
            name: item.nome,
            position: item.cargo,
            photo_url: item.foto_url,
            specialties: [],
            commission_percentage: item.comissao_percentual,
            status: item.status === 'ativo' ? ProfessionalStatus.ACTIVE : ProfessionalStatus.INACTIVE,
            business_id: businessId,
          })) || [];
          
          setProfessionals(mappedData);
          setLoading(false);
          return;
        }
        
        // If both tables failed, return empty array
        setProfessionals([]);
        
      } catch (err: any) {
        console.error('Error in useProfessionals:', err);
        setError(err.message || 'Failed to fetch professionals');
        setProfessionals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [businessId, activeOnly, withServices]);

  // CRUD operations
  const createProfessional = async (data: any) => {
    console.log("Create professional:", data);
  };
  
  const updateProfessional = async (id: string, data: any) => {
    console.log("Update professional:", id, data);
  };
  
  const deleteProfessional = async (id: string) => {
    console.log("Delete professional:", id);
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
