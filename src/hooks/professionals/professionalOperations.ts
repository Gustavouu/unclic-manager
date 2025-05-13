
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import { 
  Professional, 
  ProfessionalFormData, 
  ProfessionalStatus 
} from './types';

export const useProfessionalOperations = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { tenantId } = useTenant();
  
  // Fetch all professionals for the current tenant
  const fetchProfessionals = useCallback(async () => {
    if (!tenantId) {
      console.warn('No tenant ID provided to fetch professionals');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to fetch from modernized 'professionals' table first
      let { data: modernProfessionals, error: modernError } = await supabase
        .from('professionals')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name');
      
      // If we have data from the modern table, use it
      if (!modernError && modernProfessionals && modernProfessionals.length > 0) {
        const mappedProfessionals = modernProfessionals.map(prof => ({
          ...prof,
          // Add backward compatibility fields
          photoUrl: prof.avatar || prof.photo_url,
          role: prof.position,
        }));
        
        setProfessionals(mappedProfessionals);
        return mappedProfessionals;
      }
      
      // If no data in the modern table, try legacy 'colaboradores' table
      const { data: legacyProfessionals, error: legacyError } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('id_negocio', tenantId)
        .order('nome');
        
      if (legacyError) {
        throw legacyError;
      }
      
      if (legacyProfessionals && legacyProfessionals.length > 0) {
        // Map legacy fields to modern fields for consistency
        const mappedProfessionals = legacyProfessionals.map(legacyProf => ({
          id: legacyProf.id,
          tenantId: legacyProf.id_negocio,
          business_id: legacyProf.id_negocio,
          id_negocio: legacyProf.id_negocio,
          name: legacyProf.nome,
          nome: legacyProf.nome,
          email: legacyProf.email,
          phone: legacyProf.telefone,
          telefone: legacyProf.telefone,
          bio: legacyProf.bio,
          avatar: legacyProf.foto_url,
          photoUrl: legacyProf.foto_url,
          isActive: legacyProf.ativo,
          ativo: legacyProf.ativo,
          workingHours: legacyProf.horarios_trabalho,
          horarios_trabalho: legacyProf.horarios_trabalho,
          commission_percentage: legacyProf.comissao_percentual,
          comissao_percentual: legacyProf.comissao_percentual,
          specialties: legacyProf.especializacoes,
          especializacoes: legacyProf.especializacoes,
          position: legacyProf.cargo,
          cargo: legacyProf.cargo,
          status: legacyProf.ativo ? ProfessionalStatus.ACTIVE : ProfessionalStatus.INACTIVE,
          createdAt: legacyProf.criado_em,
          criado_em: legacyProf.criado_em,
        }));
        
        setProfessionals(mappedProfessionals);
        return mappedProfessionals;
      }
      
      // If we get here, no professionals were found in either table
      setProfessionals([]);
      return [];
      
    } catch (error: any) {
      console.error('Error fetching professionals:', error.message);
      setError(`Error fetching professionals: ${error.message}`);
      toast.error('Erro ao buscar colaboradores');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);
  
  // Add a new professional
  const addProfessional = useCallback(async (professionalData: ProfessionalFormData) => {
    if (!tenantId) {
      toast.error('Nenhum tenant selecionado');
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare the data for insertion
      const professional: Partial<Professional> = {
        name: professionalData.name,
        email: professionalData.email,
        phone: professionalData.phone,
        bio: professionalData.bio,
        position: professionalData.position || professionalData.role,
        specialties: professionalData.specialties || [],
        commission_percentage: professionalData.commission_percentage || professionalData.commissionPercentage || 0,
        avatar: professionalData.avatar,
        photoUrl: professionalData.photoUrl || professionalData.avatar,
        isActive: true,
        tenant_id: tenantId,
        business_id: tenantId,
        status: ProfessionalStatus.ACTIVE,
      };
      
      // Insert into modern table
      const { data, error } = await supabase
        .from('professionals')
        .insert([professional])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(`Colaborador ${data.name} adicionado com sucesso!`);
      
      // Refresh the professionals list
      await fetchProfessionals();
      
      return data;
      
    } catch (error: any) {
      console.error('Error adding professional:', error);
      toast.error(`Erro ao adicionar colaborador: ${error.message}`);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, fetchProfessionals]);
  
  // Update an existing professional
  const updateProfessional = useCallback(async (id: string, professionalData: Partial<ProfessionalFormData>) => {
    if (!tenantId) {
      toast.error('Nenhum tenant selecionado');
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Update the professional data
      const updates: Partial<Professional> = {
        name: professionalData.name,
        email: professionalData.email,
        phone: professionalData.phone,
        bio: professionalData.bio,
        position: professionalData.position || professionalData.role,
        specialties: professionalData.specialties,
        commission_percentage: professionalData.commission_percentage || professionalData.commissionPercentage,
        avatar: professionalData.photoUrl || professionalData.photo_url || professionalData.avatar,
        photoUrl: professionalData.photoUrl || professionalData.photo_url || professionalData.avatar,
        status: professionalData.status,
        updatedAt: new Date().toISOString(),
      };
      
      // First try to update in the modern table
      const { data, error } = await supabase
        .from('professionals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        // If failed, try to update in the legacy table
        // Map to legacy field names
        const legacyUpdates = {
          nome: updates.name,
          email: updates.email,
          telefone: updates.phone,
          bio: updates.bio,
          cargo: updates.position,
          especializacoes: updates.specialties,
          comissao_percentual: updates.commission_percentage,
          foto_url: updates.photoUrl,
          ativo: updates.status === ProfessionalStatus.ACTIVE,
          atualizado_em: updates.updatedAt,
        };
        
        const { data: legacyData, error: legacyError } = await supabase
          .from('colaboradores')
          .update(legacyUpdates)
          .eq('id', id)
          .select()
          .single();
          
        if (legacyError) throw legacyError;
        
        toast.success(`Colaborador ${legacyData.nome} atualizado com sucesso!`);
        await fetchProfessionals();
        return legacyData;
      }
      
      toast.success(`Colaborador ${data.name} atualizado com sucesso!`);
      await fetchProfessionals();
      return data;
      
    } catch (error: any) {
      console.error('Error updating professional:', error);
      toast.error(`Erro ao atualizar colaborador: ${error.message}`);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, fetchProfessionals]);
  
  // Update only the status of a professional
  const updateProfessionalStatus = useCallback(async (id: string, status: ProfessionalStatus) => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    
    try {
      // First try to update in the modern table
      const { data, error } = await supabase
        .from('professionals')
        .update({ 
          status,
          isActive: status === ProfessionalStatus.ACTIVE,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        // If failed, try to update in the legacy table
        const { data: legacyData, error: legacyError } = await supabase
          .from('colaboradores')
          .update({ 
            ativo: status === ProfessionalStatus.ACTIVE,
            atualizado_em: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
          
        if (legacyError) throw legacyError;
        
        await fetchProfessionals();
        return legacyData;
      }
      
      await fetchProfessionals();
      return data;
      
    } catch (error: any) {
      console.error('Error updating professional status:', error);
      toast.error(`Erro ao atualizar status do colaborador: ${error.message}`);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, fetchProfessionals]);
  
  // Delete a professional
  const removeProfessional = useCallback(async (id: string) => {
    if (!tenantId) return false;
    
    setIsLoading(true);
    
    try {
      // First try to delete from the modern table
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);
      
      if (error) {
        // If failed, try to delete from the legacy table
        const { error: legacyError } = await supabase
          .from('colaboradores')
          .delete()
          .eq('id', id);
          
        if (legacyError) throw legacyError;
      }
      
      toast.success('Colaborador excluído com sucesso!');
      await fetchProfessionals();
      return true;
      
    } catch (error: any) {
      console.error('Error deleting professional:', error);
      toast.error(`Erro ao excluir colaborador: ${error.message}`);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, fetchProfessionals]);
  
  // Get a professional by ID
  const getProfessionalById = useCallback((id: string): Professional | undefined => {
    return professionals.find(p => p.id === id);
  }, [professionals]);
  
  // Load professionals when the component mounts or tenantId changes
  useEffect(() => {
    if (tenantId) {
      fetchProfessionals();
    } else {
      console.warn('No tenant ID available, professionals not loaded');
    }
  }, [tenantId, fetchProfessionals]);
  
  return {
    professionals,
    isLoading,
    error,
    fetchProfessionals,
    addProfessional,
    updateProfessional,
    updateProfessionalStatus,
    removeProfessional,
    getProfessionalById
  };
};
