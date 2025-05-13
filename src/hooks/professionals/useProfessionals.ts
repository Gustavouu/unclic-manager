
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import { Professional, ProfessionalFormData } from './types';

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const fetchProfessionals = useCallback(async () => {
    if (!businessId) {
      console.log('No business ID available, skipping professionals fetch');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching professionals for business ID:', businessId);
      
      // First try to fetch from the new employees/professionals table
      let { data: professionalData, error: professionalError } = await supabase
        .from('professionals')
        .select('*')
        .eq('tenantId', businessId);
      
      // If no data from new table, try legacy funcionarios table
      if ((professionalError || !professionalData || professionalData.length === 0)) {
        console.log('No data in professionals table, trying employees table');
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('*')
          .eq('business_id', businessId);
          
        if ((employeeError || !employeeData || employeeData.length === 0)) {
          console.log('No data in employees table, trying funcionarios table');
          const { data: funcionariosData, error: funcionariosError } = await supabase
            .from('funcionarios')
            .select('*')
            .eq('id_negocio', businessId);
            
          if (funcionariosError) {
            console.error('Error fetching from funcionarios:', funcionariosError);
            throw funcionariosError;
          }
          
          // Use funcionarios data if available
          if (funcionariosData && funcionariosData.length > 0) {
            professionalData = funcionariosData.map(funcionario => ({
              id: funcionario.id,
              tenantId: funcionario.id_negocio,
              business_id: funcionario.id_negocio,
              id_negocio: funcionario.id_negocio,
              userId: funcionario.id_usuario,
              user_id: funcionario.id_usuario,
              name: funcionario.nome,
              nome: funcionario.nome,
              email: funcionario.email,
              phone: funcionario.telefone,
              telefone: funcionario.telefone,
              bio: funcionario.bio,
              position: funcionario.cargo,
              cargo: funcionario.cargo,
              specialties: funcionario.especializacoes,
              especializacoes: funcionario.especializacoes,
              commission_percentage: funcionario.comissao_percentual,
              comissao_percentual: funcionario.comissao_percentual,
              hire_date: funcionario.data_contratacao,
              data_contratacao: funcionario.data_contratacao,
              hireDate: funcionario.data_contratacao,
              avatar: funcionario.foto_url,
              foto_url: funcionario.foto_url,
              isActive: funcionario.status === 'ativo',
              ativo: funcionario.status === 'ativo',
              createdAt: funcionario.criado_em,
              criado_em: funcionario.criado_em,
              updatedAt: funcionario.atualizado_em,
              atualizado_em: funcionario.atualizado_em,
            }));
          }
        } else {
          // Use employees data
          professionalData = employeeData.map(employee => ({
            id: employee.id,
            tenantId: employee.business_id,
            business_id: employee.business_id,
            id_negocio: employee.business_id,
            userId: employee.user_id,
            user_id: employee.user_id,
            name: employee.name,
            nome: employee.name,
            email: employee.email,
            phone: employee.phone,
            telefone: employee.phone,
            bio: employee.bio,
            position: employee.position,
            cargo: employee.position,
            specialties: employee.specialties,
            especializacoes: employee.specialties,
            commission_percentage: employee.commission_percentage,
            comissao_percentual: employee.commission_percentage,
            hire_date: employee.hire_date,
            data_contratacao: employee.hire_date,
            hireDate: employee.hire_date,
            avatar: employee.photo_url,
            foto_url: employee.photo_url,
            isActive: employee.status === 'active',
            ativo: employee.status === 'active',
            createdAt: employee.created_at,
            criado_em: employee.created_at,
            updatedAt: employee.updated_at,
            atualizado_em: employee.updated_at,
          }));
        }
      }
      
      setProfessionals(professionalData || []);
    } catch (err: any) {
      console.error('Error fetching professionals:', err);
      setError(err.message);
      toast.error('Erro ao carregar profissionais');
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  const createProfessional = async (formData: ProfessionalFormData): Promise<Professional | null> => {
    if (!businessId) {
      setError('Business ID is required');
      return null;
    }

    try {
      // Prepare data for insertion
      const professionalData = {
        tenantId: businessId,
        business_id: businessId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        position: formData.position,
        specialties: formData.specialties,
        commission_percentage: formData.commission_percentage,
        avatar: formData.avatar,
        isActive: formData.isActive ?? true
      };

      // Try inserting into professionals table first
      let { data, error } = await supabase
        .from('professionals')
        .insert([professionalData])
        .select()
        .single();

      // If that fails, try employees table
      if (error) {
        console.log('Could not insert into professionals, trying employees', error);
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .insert([{
            business_id: businessId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
            position: formData.position,
            specialties: formData.specialties,
            commission_percentage: formData.commission_percentage,
            photo_url: formData.avatar,
            status: formData.isActive ? 'active' : 'inactive',
          }])
          .select()
          .single();

        if (employeeError) {
          console.log('Could not insert into employees, trying funcionarios', employeeError);
          // If employees fails too, try funcionarios table
          const { data: funcionarioData, error: funcionarioError } = await supabase
            .from('funcionarios')
            .insert([{
              id_negocio: businessId,
              nome: formData.name,
              email: formData.email,
              telefone: formData.phone,
              bio: formData.bio,
              cargo: formData.position,
              especializacoes: formData.specialties,
              comissao_percentual: formData.commission_percentage,
              foto_url: formData.avatar,
              status: formData.isActive ? 'ativo' : 'inativo',
            }])
            .select()
            .single();
            
          if (funcionarioError) throw funcionarioError;
          
          data = {
            id: funcionarioData.id,
            tenantId: funcionarioData.id_negocio,
            name: funcionarioData.nome,
            email: funcionarioData.email,
            phone: funcionarioData.telefone,
            bio: funcionarioData.bio,
            position: funcionarioData.cargo,
            specialties: funcionarioData.especializacoes,
            commission_percentage: funcionarioData.comissao_percentual,
            avatar: funcionarioData.foto_url,
            isActive: funcionarioData.status === 'ativo',
          };
        } else {
          data = {
            id: employeeData.id,
            tenantId: employeeData.business_id,
            name: employeeData.name,
            email: employeeData.email,
            phone: employeeData.phone,
            bio: employeeData.bio,
            position: employeeData.position,
            specialties: employeeData.specialties,
            commission_percentage: employeeData.commission_percentage,
            avatar: employeeData.photo_url,
            isActive: employeeData.status === 'active',
          };
        }
      }

      const newProfessional = data as Professional;
      setProfessionals(prev => [...prev, newProfessional]);
      toast.success('Profissional criado com sucesso');
      
      return newProfessional;
    } catch (err: any) {
      console.error('Error creating professional:', err);
      toast.error('Erro ao criar profissional: ' + err.message);
      return null;
    }
  };

  const updateProfessional = async (id: string, formData: Partial<ProfessionalFormData>): Promise<Professional | null> => {
    try {
      // Try updating professionals table first
      let { data, error } = await supabase
        .from('professionals')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          position: formData.position,
          specialties: formData.specialties,
          commission_percentage: formData.commission_percentage,
          avatar: formData.avatar,
          isActive: formData.isActive
        })
        .eq('id', id)
        .select()
        .single();

      // If that fails, try employees table
      if (error) {
        console.log('Could not update professionals, trying employees', error);
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
            position: formData.position,
            specialties: formData.specialties,
            commission_percentage: formData.commission_percentage,
            photo_url: formData.avatar,
            status: formData.isActive ? 'active' : 'inactive',
          })
          .eq('id', id)
          .select()
          .single();

        if (employeeError) {
          console.log('Could not update employees, trying funcionarios', employeeError);
          // If employees fails too, try funcionarios table
          const { data: funcionarioData, error: funcionarioError } = await supabase
            .from('funcionarios')
            .update({
              nome: formData.name,
              email: formData.email,
              telefone: formData.phone,
              bio: formData.bio,
              cargo: formData.position,
              especializacoes: formData.specialties,
              comissao_percentual: formData.commission_percentage,
              foto_url: formData.avatar,
              status: formData.isActive ? 'ativo' : 'inativo',
            })
            .eq('id', id)
            .select()
            .single();
            
          if (funcionarioError) throw funcionarioError;
          
          data = {
            id: funcionarioData.id,
            tenantId: funcionarioData.id_negocio,
            name: funcionarioData.nome,
            email: funcionarioData.email,
            phone: funcionarioData.telefone,
            bio: funcionarioData.bio,
            position: funcionarioData.cargo,
            specialties: funcionarioData.especializacoes,
            commission_percentage: funcionarioData.comissao_percentual,
            avatar: funcionarioData.foto_url,
            isActive: funcionarioData.status === 'ativo',
          };
        } else {
          data = {
            id: employeeData.id,
            tenantId: employeeData.business_id,
            name: employeeData.name,
            email: employeeData.email,
            phone: employeeData.phone,
            bio: employeeData.bio,
            position: employeeData.position,
            specialties: employeeData.specialties,
            commission_percentage: employeeData.commission_percentage,
            avatar: employeeData.photo_url,
            isActive: employeeData.status === 'active',
          };
        }
      }

      const updatedProfessional = data as Professional;
      setProfessionals(prev => 
        prev.map(professional => 
          professional.id === id ? updatedProfessional : professional
        )
      );
      
      toast.success('Profissional atualizado com sucesso');
      return updatedProfessional;
    } catch (err: any) {
      console.error('Error updating professional:', err);
      toast.error('Erro ao atualizar profissional: ' + err.message);
      return null;
    }
  };

  const deleteProfessional = async (id: string): Promise<boolean> => {
    try {
      // Try deleting from professionals table first
      let { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      // If that fails, try employees table
      if (error) {
        console.log('Could not delete from professionals, trying employees', error);
        const { error: employeeError } = await supabase
          .from('employees')
          .delete()
          .eq('id', id);

        if (employeeError) {
          console.log('Could not delete from employees, trying funcionarios', employeeError);
          // If employees fails too, try funcionarios table
          const { error: funcionarioError } = await supabase
            .from('funcionarios')
            .delete()
            .eq('id', id);
            
          if (funcionarioError) throw funcionarioError;
        }
      }

      setProfessionals(prev => prev.filter(professional => professional.id !== id));
      toast.success('Profissional excluído com sucesso');
      return true;
    } catch (err: any) {
      console.error('Error deleting professional:', err);
      toast.error('Erro ao excluir profissional: ' + err.message);
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
};
