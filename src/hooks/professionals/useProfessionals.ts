
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  photoUrl?: string;
  specialties?: string[];
  status?: string;
  businessId: string;
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
    status: 'active',
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
    status: 'active',
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
    status: 'active',
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
            status: professional.status,
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
          status: professional.status,
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

  useEffect(() => {
    fetchProfessionals();
  }, [businessId]);

  return {
    professionals,
    isLoading,
    error,
    refetch: fetchProfessionals,
  };
};
