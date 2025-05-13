
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Professional, ProfessionalInput, ProfessionalFilters } from './types';
import { toast } from 'sonner';
import { useTenant } from '@/contexts/TenantContext';

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const fetchProfessionals = useCallback(async (filters?: ProfessionalFilters) => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching professionals for business ID:', businessId);
      
      // First, try to fetch from the new employees table
      let { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('business_id', businessId);
      
      if (error) {
        console.log('Error fetching from employees, trying legacy table instead');
        
        // If that fails, try the legacy funcionarios table
        const { data: legacyData, error: legacyError } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('id_negocio', businessId);
        
        if (legacyError) throw legacyError;
        
        // Map the legacy data to the new format
        data = (legacyData || []).map(p => ({
          id: p.id,
          name: p.nome,
          email: p.email,
          phone: p.telefone,
          bio: p.bio,
          avatar: p.foto_url,
          specialties: p.especializacoes,
          position: p.cargo,
          status: p.status,
          commission_percentage: p.comissao_percentual,
          hire_date: p.data_contratacao,
          business_id: p.id_negocio,
          user_id: p.id_usuario,
          created_at: p.criado_em,
          updated_at: p.atualizado_em
        }));
      }

      // Apply filters
      let filteredData = [...(data || [])];
      
      if (filters) {
        if (filters.isActive !== undefined) {
          filteredData = filteredData.filter(p => 
            (p.status === 'active' || p.status === 'ativo' || p.isActive) === filters.isActive
          );
        }
        
        if (filters.specialties && filters.specialties.length > 0) {
          filteredData = filteredData.filter(p => 
            p.specialties && p.specialties.some(s => filters.specialties?.includes(s))
          );
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(p => 
            p.name.toLowerCase().includes(searchLower) || 
            p.email?.toLowerCase().includes(searchLower) ||
            p.phone?.toLowerCase().includes(searchLower)
          );
        }
      }

      setProfessionals(filteredData);
    } catch (err: any) {
      console.error('Error fetching professionals:', err);
      setError(err.message);
      toast.error('Erro ao carregar profissionais');
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  const createProfessional = async (professionalData: ProfessionalInput): Promise<Professional | null> => {
    if (!businessId) {
      toast.error('ID do negócio não disponível');
      return null;
    }

    try {
      // Prepare data in new format
      const newProfessional = {
        business_id: businessId,
        name: professionalData.name,
        email: professionalData.email,
        phone: professionalData.phone,
        bio: professionalData.bio,
        photo_url: professionalData.avatar,
        specialties: professionalData.specialties,
        position: professionalData.position,
        status: 'active',
        commission_percentage: professionalData.commission_percentage || 0
      };

      // Insert into employees table
      const { data, error } = await supabase
        .from('employees')
        .insert([newProfessional])
        .select()
        .single();

      if (error) throw error;

      const createdProfessional: Professional = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        avatar: data.photo_url,
        specialties: data.specialties,
        position: data.position,
        status: data.status,
        isActive: data.status === 'active',
        commission_percentage: data.commission_percentage,
        business_id: data.business_id,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setProfessionals(prev => [...prev, createdProfessional]);
      toast.success('Profissional criado com sucesso!');
      return createdProfessional;
    } catch (err: any) {
      console.error('Error creating professional:', err);
      toast.error('Erro ao criar profissional');
      return null;
    }
  };

  const updateProfessional = async (id: string, professionalData: Partial<ProfessionalInput>): Promise<boolean> => {
    try {
      // First try to update in employees table
      const { error } = await supabase
        .from('employees')
        .update({
          name: professionalData.name,
          email: professionalData.email,
          phone: professionalData.phone,
          bio: professionalData.bio,
          photo_url: professionalData.avatar,
          specialties: professionalData.specialties,
          position: professionalData.position,
          commission_percentage: professionalData.commission_percentage
        })
        .eq('id', id);

      if (error) {
        // If that fails, try the legacy funcionarios table
        const { error: legacyError } = await supabase
          .from('funcionarios')
          .update({
            nome: professionalData.name,
            email: professionalData.email,
            telefone: professionalData.phone,
            bio: professionalData.bio,
            foto_url: professionalData.avatar,
            especializacoes: professionalData.specialties,
            cargo: professionalData.position,
            comissao_percentual: professionalData.commission_percentage
          })
          .eq('id', id);

        if (legacyError) throw legacyError;
      }

      // Update state
      setProfessionals(prev => prev.map(p => 
        p.id === id ? { ...p, ...professionalData } : p
      ));

      toast.success('Profissional atualizado com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Error updating professional:', err);
      toast.error('Erro ao atualizar profissional');
      return false;
    }
  };

  const deleteProfessional = async (id: string): Promise<boolean> => {
    try {
      // First try to delete from employees table
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        // If that fails, try the legacy funcionarios table
        const { error: legacyError } = await supabase
          .from('funcionarios')
          .delete()
          .eq('id', id);

        if (legacyError) throw legacyError;
      }

      // Update state
      setProfessionals(prev => prev.filter(p => p.id !== id));
      toast.success('Profissional excluído com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Error deleting professional:', err);
      toast.error('Erro ao excluir profissional');
      return false;
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  return {
    professionals,
    isLoading,
    error,
    fetchProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional
  };
}
