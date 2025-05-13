
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { 
  Professional, 
  ProfessionalInput, 
  ProfessionalFilters,
  ProfessionalStatus,
  PROFESSIONAL_STATUS,
  STATUS_MAPPING,
  ProfessionalCreateForm
} from "./types";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from 'sonner';

// Function to fetch professionals from the database
const fetchProfessionalsFromDB = async (businessId: string, filters?: ProfessionalFilters) => {
  let query = supabase
    .from('funcionarios')
    .select('*')
    .eq('id_negocio', businessId);
  
  // Apply filters if provided
  if (filters) {
    if (filters.isActive !== undefined) {
      query = query.eq('status', filters.isActive ? 'active' : 'inactive');
    }
    
    if (filters.specialties && filters.specialties.length > 0) {
      query = query.contains('especializacoes', filters.specialties);
    }
    
    if (filters.search) {
      query = query.ilike('nome', `%${filters.search}%`);
    }
  }
  
  const { data, error } = await query.order('nome');
  
  if (error) {
    throw error;
  }
  
  // Map database fields to our Professional interface
  return (data || []).map(prof => {
    // Map from legacy status to new status format
    let status: ProfessionalStatus;
    switch(prof.status) {
      case 'active':
        status = PROFESSIONAL_STATUS.ACTIVE;
        break;
      case 'inactive':
        status = PROFESSIONAL_STATUS.INACTIVE;
        break;
      case 'vacation':
      case 'leave':
        status = PROFESSIONAL_STATUS.ON_LEAVE;
        break;
      default:
        status = PROFESSIONAL_STATUS.ACTIVE;
    }
    
    return {
      id: prof.id,
      name: prof.nome,
      email: prof.email || '',
      phone: prof.telefone || '',
      specialties: prof.especializacoes || [],
      bio: prof.bio || '',
      status: status,
      commission_percentage: prof.comissao_percentual || 0,
      hire_date: prof.data_contratacao || '',
      business_id: prof.id_negocio,
      user_id: prof.id_usuario,
      position: prof.cargo || '',
      // Add compatibility fields for both naming conventions
      role: prof.cargo || '',
      photoUrl: prof.foto_url || '',
      hireDate: prof.data_contratacao || '',
      commissionPercentage: prof.comissao_percentual || 0,
      userId: prof.id_usuario
    };
  });
};

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { businessId } = useTenant() || { businessId: null };
  
  // Function to fetch professionals
  const fetchProfessionals = async (filters?: ProfessionalFilters) => {
    if (!businessId) {
      setError("No business ID available");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const data = await fetchProfessionalsFromDB(businessId, filters);
      setProfessionals(data);
      setError("");
    } catch (err) {
      console.error("Error fetching professionals:", err);
      setError("Failed to load professionals");
      toast.error("Erro ao carregar profissionais");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch professionals on component mount
  useEffect(() => {
    fetchProfessionals();
  }, [businessId]);
  
  // Function to add a new professional
  const createProfessional = async (professionalData: ProfessionalInput) => {
    if (!businessId) {
      throw new Error("No business ID available");
    }
    
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .insert([{
          nome: professionalData.name,
          email: professionalData.email || '',
          telefone: professionalData.phone || '',
          cargo: professionalData.position || '',
          especializacoes: professionalData.specialties || [],
          bio: professionalData.bio || '',
          comissao_percentual: professionalData.commission_percentage || 0,
          status: 'active',
          id_negocio: businessId
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Map the newly created professional to our interface
      const newProfessional: Professional = {
        id: data.id,
        name: data.nome,
        email: data.email || '',
        phone: data.telefone || '',
        specialties: data.especializacoes || [],
        bio: data.bio || '',
        status: PROFESSIONAL_STATUS.ACTIVE,
        commission_percentage: data.comissao_percentual || 0,
        hire_date: data.data_contratacao || '',
        business_id: data.id_negocio,
        user_id: data.id_usuario,
        position: data.cargo || '',
        // Add compatibility fields
        role: data.cargo || '',
        photoUrl: data.foto_url || '',
        hireDate: data.data_contratacao || '',
        commissionPercentage: data.comissao_percentual || 0,
        userId: data.id_usuario
      };
      
      // Update local state
      setProfessionals(prev => [...prev, newProfessional]);
      toast.success("Profissional adicionado com sucesso!");
      
      return newProfessional;
    } catch (err) {
      console.error("Error creating professional:", err);
      toast.error("Erro ao adicionar profissional");
      throw err;
    }
  };
  
  // Function to update a professional
  const updateProfessional = async (id: string, professionalData: Partial<Professional>) => {
    try {
      const updateData: any = {};
      
      // Map fields to database column names
      if (professionalData.name) updateData.nome = professionalData.name;
      if (professionalData.email !== undefined) updateData.email = professionalData.email;
      if (professionalData.phone !== undefined) updateData.telefone = professionalData.phone;
      if (professionalData.specialties) updateData.especializacoes = professionalData.specialties;
      if (professionalData.bio !== undefined) updateData.bio = professionalData.bio;
      if (professionalData.position !== undefined) updateData.cargo = professionalData.position;
      if (professionalData.role !== undefined) updateData.cargo = professionalData.role;
      if (professionalData.commission_percentage !== undefined) updateData.comissao_percentual = professionalData.commission_percentage;
      if (professionalData.commissionPercentage !== undefined) updateData.comissao_percentual = professionalData.commissionPercentage;
      if (professionalData.photoUrl !== undefined) updateData.foto_url = professionalData.photoUrl;
      if (professionalData.avatar !== undefined) updateData.foto_url = professionalData.avatar;
      
      // Convert status to database format if needed
      if (professionalData.status) {
        if (professionalData.status === PROFESSIONAL_STATUS.ACTIVE) updateData.status = 'active';
        else if (professionalData.status === PROFESSIONAL_STATUS.INACTIVE) updateData.status = 'inactive';
        else if (professionalData.status === PROFESSIONAL_STATUS.ON_LEAVE) updateData.status = 'vacation';
      }
      
      const { data, error } = await supabase
        .from('funcionarios')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the professional in the local state
      setProfessionals(prev =>
        prev.map(p => p.id === id ? {
          ...p,
          ...professionalData,
          // Ensure both naming conventions are updated
          role: professionalData.position || professionalData.role || p.role,
          position: professionalData.position || professionalData.role || p.position,
          commissionPercentage: professionalData.commission_percentage || professionalData.commissionPercentage || p.commissionPercentage,
          commission_percentage: professionalData.commission_percentage || professionalData.commissionPercentage || p.commission_percentage
        } : p)
      );
      
      toast.success("Profissional atualizado com sucesso!");
      return true;
    } catch (err) {
      console.error("Error updating professional:", err);
      toast.error("Erro ao atualizar profissional");
      throw err;
    }
  };
  
  // Function to delete a professional
  const deleteProfessional = async (id: string) => {
    try {
      // We don't actually delete - just update status to inactive
      const { error } = await supabase
        .from('funcionarios')
        .update({ status: 'inactive' })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the professional status in the local state
      setProfessionals(prev =>
        prev.map(p => p.id === id ? { ...p, status: PROFESSIONAL_STATUS.INACTIVE } : p)
      );
      
      toast.success("Profissional removido com sucesso!");
      return true;
    } catch (err) {
      console.error("Error deleting professional:", err);
      toast.error("Erro ao remover profissional");
      throw err;
    }
  };

  // Function to get a professional by ID
  const getProfessionalById = (id: string): Professional | undefined => {
    return professionals.find(p => p.id === id);
  };

  // For backward compatibility with existing code
  const addProfessional = createProfessional;
  const removeProfessional = deleteProfessional;
  
  // Create an array of unique specialties from all professionals
  const specialties = Array.from(
    new Set(professionals.flatMap(p => p.specialties || []))
  );
  
  return {
    professionals,
    specialties,
    isLoading,
    error,
    fetchProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional,
    getProfessionalById,
    // Backward compatibility
    addProfessional,
    removeProfessional
  };
};
