
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Professional, ProfessionalStatus } from "./types";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { toast } from "sonner";

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const { businessId } = useCurrentBusiness();

  const fetchProfessionals = async () => {
    if (!businessId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('business_id', businessId)
        .order('name', { ascending: true });

      if (error) throw error;
      
      // Extract unique specialties
      const allSpecialties = new Set<string>();
      
      const mappedProfessionals: Professional[] = (data || []).map(prof => {
        // Add all specialties to the set
        if (Array.isArray(prof.specialties)) {
          prof.specialties.forEach(specialty => allSpecialties.add(specialty));
        }
        
        // Map from database status to enum
        let status = ProfessionalStatus.ACTIVE;
        if (prof.status === 'inactive') status = ProfessionalStatus.INACTIVE;
        else if (prof.status === 'vacation' || prof.status === 'on_leave') status = ProfessionalStatus.ON_LEAVE;
          
        return {
          id: prof.id,
          name: prof.name,
          role: prof.position || '', // Use position field, map to role for compatibility
          email: prof.email || '',
          phone: prof.phone || '',
          specialties: prof.specialties || [],
          photoUrl: prof.photo_url || '', // Map for backward compatibility
          photo_url: prof.photo_url || '',
          bio: prof.bio || '',
          status: status,
          hire_date: prof.hire_date ? new Date(prof.hire_date) : undefined,
          commission_percentage: prof.commission_percentage || 0,
          commissionPercentage: prof.commission_percentage || 0, // For backward compatibility
          isActive: prof.status === 'active',
          userId: prof.user_id,
          business_id: prof.business_id
        };
      });
      
      setProfessionals(mappedProfessionals);
      setSpecialties(Array.from(allSpecialties));
    } catch (error: any) {
      console.error("Error fetching professionals:", error.message);
      toast.error("Erro ao carregar colaboradores");
    } finally {
      setIsLoading(false);
    }
  };

  const addProfessional = async (data: Professional) => {
    if (!businessId) {
      toast.error("ID do negócio não disponível");
      return null;
    }
    
    try {
      setIsLoading(true);
      // Map enum status to database format
      let dbStatus = 'active';
      if (data.status === ProfessionalStatus.INACTIVE) dbStatus = 'inactive';
      else if (data.status === ProfessionalStatus.ON_LEAVE) dbStatus = 'vacation';
      
      const { data: newProfData, error } = await supabase
        .from('funcionarios')
        .insert({
          name: data.name,
          position: data.position || data.role || '',
          email: data.email || '',
          phone: data.phone || '',
          specialties: Array.isArray(data.specialties) ? data.specialties : [],
          bio: data.bio || '',
          status: dbStatus,
          commission_percentage: data.commission_percentage || data.commissionPercentage || 0,
          hire_date: new Date().toISOString().split('T')[0],
          photo_url: data.photo_url || data.photoUrl || '',
          business_id: businessId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (newProfData) {
        const newProfessional: Professional = {
          id: newProfData.id,
          name: newProfData.name,
          role: newProfData.position || '',
          position: newProfData.position || '',
          email: newProfData.email || '',
          phone: newProfData.phone || '',
          specialties: newProfData.specialties || [],
          photoUrl: newProfData.photo_url || '',
          photo_url: newProfData.photo_url || '',
          bio: newProfData.bio || '',
          status: ProfessionalStatus.ACTIVE,
          hire_date: newProfData.hire_date ? new Date(newProfData.hire_date) : undefined,
          commission_percentage: newProfData.commission_percentage || 0,
          commissionPercentage: newProfData.commission_percentage || 0,
          isActive: true,
          userId: newProfData.user_id,
          business_id: newProfData.business_id
        };
        
        setProfessionals(prev => [...prev, newProfessional]);
        toast.success("Colaborador adicionado com sucesso!");
        
        return newProfessional;
      }
      
      return null;
    } catch (error: any) {
      toast.error(`Erro ao adicionar profissional: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfessional = async (id: string, updates: Partial<Professional>) => {
    try {
      // Map enum status to database format if status is being updated
      let dbUpdates: any = { ...updates };
      
      if (updates.status) {
        if (updates.status === ProfessionalStatus.ACTIVE) dbUpdates.status = 'active';
        else if (updates.status === ProfessionalStatus.INACTIVE) dbUpdates.status = 'inactive';
        else if (updates.status === ProfessionalStatus.ON_LEAVE) dbUpdates.status = 'vacation';
      }
      
      // Handle field name differences
      if (updates.position !== undefined) dbUpdates.position = updates.position;
      if (updates.role !== undefined) dbUpdates.position = updates.role;
      if (updates.photo_url !== undefined) dbUpdates.photo_url = updates.photo_url;
      if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl;
      if (updates.commission_percentage !== undefined) dbUpdates.commission_percentage = updates.commission_percentage;
      if (updates.commissionPercentage !== undefined) dbUpdates.commission_percentage = updates.commissionPercentage;
      
      // Remove non-database fields
      delete dbUpdates.role;
      delete dbUpdates.photoUrl;
      delete dbUpdates.commissionPercentage;
      
      const { error } = await supabase
        .from('funcionarios')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      
      setProfessionals(prev => prev.map(pro => 
        pro.id === id ? { ...pro, ...updates } : pro
      ));
      
      toast.success("Profissional atualizado com sucesso!");
      return true;
    } catch (error: any) {
      toast.error(`Erro ao atualizar profissional: ${error.message}`);
      return false;
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProfessionals(prev => prev.filter(pro => pro.id !== id));
      toast.success("Profissional removido com sucesso!");
      return true;
    } catch (error: any) {
      toast.error(`Erro ao remover profissional: ${error.message}`);
      return false;
    }
  };

  // Alias for compatibility
  const removeProfessional = deleteProfessional;

  // Utility function to get professional by ID
  const getProfessionalById = (id: string) => {
    return professionals.find(p => p.id === id);
  };

  useEffect(() => {
    if (businessId) {
      fetchProfessionals();
    }
  }, [businessId]);

  return {
    professionals,
    isLoading,
    specialties,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    removeProfessional,
    getProfessionalById,
    refreshProfessionals: fetchProfessionals
  };
};
