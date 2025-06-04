
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import { ProfessionalStatus } from '@/hooks/professionals/types';

export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  photoUrl?: string;
  specialties?: string[];
  status?: ProfessionalStatus;
  businessId: string;
}

export interface ProfessionalFormData {
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  photoUrl?: string;
  specialties?: string[];
  status?: ProfessionalStatus;
}

// Dados de exemplo para profissionais
const createSampleProfessionals = (businessId: string): Professional[] => [
  {
    id: 'sample-prof-1',
    name: 'Ana Santos',
    email: 'ana.santos@email.com',
    phone: '(11) 99999-1111',
    position: 'Cabeleireira Senior',
    bio: 'Especialista em cortes femininos e tratamentos capilares',
    photoUrl: '',
    specialties: ['Cortes Femininos', 'Coloração', 'Tratamentos'],
    status: ProfessionalStatus.ACTIVE,
    businessId,
  },
  {
    id: 'sample-prof-2',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@email.com',
    phone: '(11) 99999-2222',
    position: 'Barbeiro',
    bio: 'Especialista em cortes masculinos e barba',
    photoUrl: '',
    specialties: ['Cortes Masculinos', 'Barba', 'Bigode'],
    status: ProfessionalStatus.ACTIVE,
    businessId,
  },
  {
    id: 'sample-prof-3',
    name: 'Juliana Costa',
    email: 'juliana.costa@email.com',
    phone: '(11) 99999-3333',
    position: 'Manicure e Pedicure',
    bio: 'Especialista em cuidados com unhas e nail art',
    photoUrl: '',
    specialties: ['Manicure', 'Pedicure', 'Nail Art'],
    status: ProfessionalStatus.ACTIVE,
    businessId,
  },
];

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const fetchProfessionals = async () => {
    if (!businessId) {
      console.log('No business ID available, using sample professionals');
      const sampleData = createSampleProfessionals('sample-business');
      setProfessionals(sampleData);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Tentar buscar da tabela employees primeiro
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('business_id', businessId)
        .eq('status', 'active');

      if (employeesError) {
        console.warn('Error fetching from employees:', employeesError);
        
        // Tentar da tabela funcionarios
        const { data: funcionariosData, error: funcionariosError } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('id_negocio', businessId);

        if (funcionariosError) {
          console.warn('No professionals found in database, using sample data');
          const sampleData = createSampleProfessionals(businessId);
          setProfessionals(sampleData);
        } else if (funcionariosData && funcionariosData.length > 0) {
          const mappedProfessionals: Professional[] = funcionariosData.map((professional: any) => ({
            id: professional.id,
            name: professional.nome,
            email: professional.email,
            phone: professional.telefone,
            position: professional.cargo,
            bio: professional.bio,
            photoUrl: professional.foto_url,
            specialties: professional.especializacoes || [],
            status: ProfessionalStatus.ACTIVE,
            businessId: professional.id_negocio,
          }));
          setProfessionals(mappedProfessionals);
        } else {
          const sampleData = createSampleProfessionals(businessId);
          setProfessionals(sampleData);
        }
      } else if (employeesData && employeesData.length > 0) {
        const mappedProfessionals: Professional[] = employeesData.map((professional: any) => ({
          id: professional.id,
          name: professional.name,
          email: professional.email,
          phone: professional.phone,
          position: professional.position,
          bio: professional.bio,
          photoUrl: professional.photo_url,
          specialties: professional.specialties || [],
          status: ProfessionalStatus.ACTIVE,
          businessId: professional.business_id,
        }));
        setProfessionals(mappedProfessionals);
      } else {
        // Se não há dados, usar dados de exemplo
        const sampleData = createSampleProfessionals(businessId);
        setProfessionals(sampleData);
        console.log('No professionals found, using sample data');
      }
    } catch (err: any) {
      console.error('Error fetching professionals:', err);
      setError(err.message);
      
      // Em caso de erro, usar dados de exemplo
      const sampleData = createSampleProfessionals(businessId || 'sample-business');
      setProfessionals(sampleData);
      toast.error('Erro ao carregar profissionais, exibindo dados de exemplo');
    } finally {
      setIsLoading(false);
    }
  };

  const createProfessional = async (data: ProfessionalFormData) => {
    if (!businessId) {
      toast.error('Business ID não encontrado');
      return null;
    }

    try {
      const { data: newProfessional, error } = await supabase
        .from('employees')
        .insert([
          {
            business_id: businessId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            position: data.position,
            bio: data.bio,
            photo_url: data.photoUrl,
            specialties: data.specialties,
            status: data.status || 'active',
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Profissional criado com sucesso!');
      await fetchProfessionals();
      return newProfessional;
    } catch (error: any) {
      console.error('Error creating professional:', error);
      toast.error('Erro ao criar profissional');
      return null;
    }
  };

  const updateProfessional = async (id: string, data: Partial<ProfessionalFormData>) => {
    if (!businessId) {
      toast.error('Business ID não encontrado');
      return null;
    }

    try {
      const { data: updatedProfessional, error } = await supabase
        .from('employees')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          position: data.position,
          bio: data.bio,
          photo_url: data.photoUrl,
          specialties: data.specialties,
          status: data.status,
        })
        .eq('id', id)
        .eq('business_id', businessId)
        .select()
        .single();

      if (error) throw error;

      toast.success('Profissional atualizado com sucesso!');
      await fetchProfessionals();
      return updatedProfessional;
    } catch (error: any) {
      console.error('Error updating professional:', error);
      toast.error('Erro ao atualizar profissional');
      return null;
    }
  };

  const deleteProfessional = async (id: string) => {
    if (!businessId) {
      toast.error('Business ID não encontrado');
      return false;
    }

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id)
        .eq('business_id', businessId);

      if (error) throw error;

      toast.success('Profissional removido com sucesso!');
      await fetchProfessionals();
      return true;
    } catch (error: any) {
      console.error('Error deleting professional:', error);
      toast.error('Erro ao remover profissional');
      return false;
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [businessId]);

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
