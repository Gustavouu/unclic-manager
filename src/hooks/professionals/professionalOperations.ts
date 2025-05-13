import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Professional, ProfessionalCreateForm, ProfessionalStatus, PROFESSIONAL_STATUS } from "./types";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from 'sonner';

export const useProfessionalOperations = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { businessId } = useTenant() || { businessId: null };
  
  // Fetch professionals when component mounts
  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!businessId) {
        console.log('No business ID available, skipping professionals fetch');
        return;
      }
      
      setIsLoading(true);
      
      try {
        console.log('Fetching professionals for business ID:', businessId);
        const { data, error } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('id_negocio', businessId);
        
        if (error) {
          throw error;
        }
        
        const mappedProfessionals: Professional[] = (data || []).map(prof => {
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
            role: prof.cargo || '',
            email: prof.email || '',
            phone: prof.telefone || '',
            specialties: prof.especializacoes || [],
            photoUrl: prof.foto_url || '',
            bio: prof.bio || '',
            status: status,
            hireDate: prof.data_contratacao || '',
            commissionPercentage: prof.comissao_percentual || 0,
            userId: prof.id_usuario
          };
        });
        
        setProfessionals(mappedProfessionals);
      } catch (error) {
        console.error("Error fetching professionals:", error);
        toast.error("Erro ao carregar colaboradores");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfessionals();
  }, [businessId]);
  
  // Adicionar novo profissional
  const addProfessional = async (data: ProfessionalCreateForm) => {
    setIsLoading(true);
    
    try {
      if (!businessId) {
        throw new Error("ID do negócio não disponível");
      }
      
      // Map status to database format if needed
      let dbStatus = 'active';
      if (data.status === PROFESSIONAL_STATUS.INACTIVE) dbStatus = 'inactive';
      else if (data.status === PROFESSIONAL_STATUS.ON_LEAVE) dbStatus = 'vacation';
      
      const { data: newProfData, error } = await supabase
        .from('funcionarios')
        .insert([{
          nome: data.name,
          cargo: data.role,
          email: data.email || '',
          telefone: data.phone || '',
          especializacoes: Array.isArray(data.specialties) ? data.specialties : [],
          bio: data.bio || '',
          status: dbStatus,
          comissao_percentual: data.commissionPercentage || 0,
          data_contratacao: new Date().toISOString().split('T')[0],
          foto_url: data.photoUrl || '',
          id_negocio: businessId
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const newProfessional: Professional = {
        id: newProfData.id,
        name: newProfData.nome,
        role: newProfData.cargo || '',
        email: newProfData.email || '',
        phone: newProfData.telefone || '',
        specialties: newProfData.especializacoes || [],
        photoUrl: newProfData.foto_url || '',
        bio: newProfData.bio || '',
        status: PROFESSIONAL_STATUS.ACTIVE,
        hireDate: newProfData.data_contratacao || '',
        commissionPercentage: newProfData.comissao_percentual || 0,
        userId: newProfData.id_usuario
      };
      
      // Atualizar o estado com o novo profissional
      setProfessionals(prev => [...prev, newProfessional]);
      toast.success("Colaborador adicionado com sucesso!");
      
      return newProfessional;
    } catch (error) {
      console.error("Erro ao adicionar profissional:", error);
      toast.error("Erro ao adicionar colaborador");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Atualizar profissional
  const updateProfessional = async (id: string, data: Partial<Professional>) => {
    setIsLoading(true);
    
    try {
      const updateData: any = {};
      
      if (data.name) updateData.nome = data.name;
      if (data.role) updateData.cargo = data.role;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.telefone = data.phone;
      if (data.specialties) updateData.especializacoes = data.specialties;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.commissionPercentage !== undefined) updateData.comissao_percentual = data.commissionPercentage;
      if (data.photoUrl !== undefined) updateData.foto_url = data.photoUrl;
      
      const { data: updatedData, error } = await supabase
        .from('funcionarios')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedProfessional: Professional = {
        id: updatedData.id,
        name: updatedData.nome,
        role: updatedData.cargo || '',
        email: updatedData.email || '',
        phone: updatedData.telefone || '',
        specialties: updatedData.especializacoes || [],
        photoUrl: updatedData.foto_url || '',
        bio: updatedData.bio || '',
        status: (updatedData.status as ProfessionalStatus) || 'active',
        hireDate: updatedData.data_contratacao || '',
        commissionPercentage: updatedData.comissao_percentual || 0,
        userId: updatedData.id_usuario
      };
      
      setProfessionals(prev => 
        prev.map(p => p.id === id ? updatedProfessional : p)
      );
      
      toast.success("Colaborador atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
      toast.error("Erro ao atualizar colaborador");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Atualizar status do profissional
  const updateProfessionalStatus = async (id: string, status: ProfessionalStatus) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('funcionarios')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      setProfessionals(prev => 
        prev.map(p => p.id === id ? { ...p, status } : p)
      );
      
      toast.success("Status do colaborador atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do colaborador");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remover profissional
  const removeProfessional = async (id: string) => {
    setIsLoading(true);
    
    try {
      // We don't actually delete - just update status to inactive
      const { error } = await supabase
        .from('funcionarios')
        .update({ status: 'inactive' })
        .eq('id', id);
      
      if (error) throw error;
      
      setProfessionals(prev => 
        prev.map(p => p.id === id ? { ...p, status: 'inactive' as ProfessionalStatus } : p)
      );
      
      toast.success("Colaborador removido com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao remover profissional:", error);
      toast.error("Erro ao remover colaborador");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    professionals,
    isLoading,
    addProfessional,
    updateProfessional,
    updateProfessionalStatus,
    removeProfessional
  };
};
