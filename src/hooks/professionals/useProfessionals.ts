
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Professional, 
  ProfessionalCreateForm, 
  UseProfessionalsOptions, 
  UseProfessionalsReturn 
} from './types';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { toast } from 'sonner';
import { initialProfessionals } from './mockData';

export function useProfessionals(options: UseProfessionalsOptions = {}): UseProfessionalsReturn {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { businessId } = useCurrentBusiness();
  
  // Use the tenant ID from options if provided, otherwise use current business ID
  const effectiveTenantId = options.tenantIdOverride || businessId;

  // Extract unique specialties from professionals
  const specialties = Array.from(
    new Set(professionals.flatMap(p => p.specialties || []))
  );

  const fetchProfessionals = useCallback(async () => {
    if (!effectiveTenantId) {
      console.log('No business ID available, using mock data');
      setProfessionals(initialProfessionals);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching professionals for tenant ID:', effectiveTenantId);
      
      // Query professionals table with security enforcement
      const { data, error: fetchError } = await supabase
        .from('professionals')
        .select(`
          *,
          professional_services(serviceId)
        `)
        .eq('tenantId', effectiveTenantId)
        .eq('isActive', true);
        
      if (fetchError) throw fetchError;
      
      console.log('Professionals fetched:', data);
      
      if (data && data.length > 0) {
        const formattedProfessionals = data.map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          bio: item.bio,
          avatar: item.avatar,
          photoUrl: item.avatar, // Map avatar to photoUrl for backward compatibility
          role: item.role || '',
          specialties: item.specialties || [],
          commissionPercentage: item.commissionPercentage || 0,
          status: item.status || 'active',
          establishmentId: item.establishmentId,
          tenantId: item.tenantId,
          services: item.professional_services?.map((ps: any) => ps.serviceId) || [],
          workingHours: item.workingHours,
          isActive: item.isActive,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          userId: item.userId,
          hireDate: item.hireDate || ''
        }));
        
        setProfessionals(formattedProfessionals);
      } else {
        // If no data from API, use mock data
        setProfessionals(initialProfessionals);
      }
    } catch (err: any) {
      console.error('Error fetching professionals:', err);
      setError(err);
      
      // If error, fallback to mock data
      setProfessionals(initialProfessionals);
      
      // Only show toast if this is a user-facing operation
      if (!options.secureMode) {
        toast.error('Erro ao carregar profissionais');
      }
    } finally {
      setLoading(false);
    }
  }, [effectiveTenantId, options.secureMode]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  const createProfessional = async (data: ProfessionalCreateForm): Promise<Professional | null> => {
    if (!effectiveTenantId) {
      toast.error('Nenhum negócio selecionado');
      return null;
    }

    try {
      // Always ensure tenant ID is set properly
      const professionalData = {
        ...data,
        tenantId: effectiveTenantId,
      };

      const { data: newProfessional, error: createError } = await supabase
        .from('professionals')
        .insert(professionalData)
        .select()
        .single();

      if (createError) throw createError;

      setProfessionals(prev => [...prev, newProfessional]);
      toast.success('Profissional criado com sucesso');
      
      return newProfessional;
    } catch (err: any) {
      console.error('Error creating professional:', err);
      toast.error('Erro ao criar profissional');
      return null;
    }
  };

  const updateProfessional = async (id: string, data: Partial<Professional>): Promise<boolean> => {
    try {
      // Never allow changing the tenant ID in updates
      const { tenantId, ...updateData } = data;
      
      const { error: updateError } = await supabase
        .from('professionals')
        .update(updateData)
        .eq('id', id)
        .eq('tenantId', effectiveTenantId); // Security check
      
      if (updateError) throw updateError;
      
      setProfessionals(prev => 
        prev.map(p => p.id === id ? { ...p, ...updateData } : p)
      );
      
      toast.success('Profissional atualizado com sucesso');
      return true;
    } catch (err: any) {
      console.error('Error updating professional:', err);
      toast.error('Erro ao atualizar profissional');
      return false;
    }
  };

  const deleteProfessional = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id)
        .eq('tenantId', effectiveTenantId); // Security check
      
      if (deleteError) throw deleteError;
      
      setProfessionals(prev => prev.filter(p => p.id !== id));
      toast.success('Profissional removido com sucesso');
      return true;
    } catch (err: any) {
      console.error('Error deleting professional:', err);
      toast.error('Erro ao remover profissional');
      return false;
    }
  };

  const getProfessionalById = (id: string): Professional | undefined => {
    return professionals.find(p => p.id === id);
  };

  return {
    professionals,
    loading,
    error,
    specialties,
    isLoading: loading, // Alias for loading
    refetch: fetchProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional,
    getProfessionalById,
    // Aliases for existing methods to maintain compatibility
    addProfessional: createProfessional,
    removeProfessional: deleteProfessional
  };
}
