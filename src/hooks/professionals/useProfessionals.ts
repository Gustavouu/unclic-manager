
import { useState, useEffect } from 'react';
import { Professional, ProfessionalCreateForm } from './types';

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [specialties, setSpecialties] = useState<string[]>([]);

  // Fetch professionals from API or mock data
  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      // Simulate API call with timeout
      setTimeout(() => {
        setProfessionals([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '(11) 99999-9999',
            photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
            bio: 'Profissional experiente com mais de 10 anos de experiência.',
            specialties: ['Corte Masculino', 'Barba'],
            status: 'ACTIVE',
            commissionPercentage: 30
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '(11) 88888-8888',
            photoUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
            bio: 'Especialista em coloração e tratamentos capilares.',
            specialties: ['Coloração', 'Tratamentos'],
            status: 'ACTIVE',
            commissionPercentage: 35
          }
        ]);
        setSpecialties(['Corte Masculino', 'Barba', 'Coloração', 'Tratamentos', 'Manicure', 'Pedicure']);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Erro ao carregar profissionais');
      setLoading(false);
      console.error(err);
    }
  };

  // Add professional to the list
  const addProfessional = async (professional: ProfessionalCreateForm): Promise<void> => {
    try {
      // Simulate API call
      setTimeout(() => {
        const newProfessional: Professional = {
          id: Date.now().toString(),
          ...professional,
          status: 'ACTIVE'
        };
        setProfessionals([...professionals, newProfessional]);
      }, 500);
    } catch (err) {
      setError('Erro ao adicionar profissional');
      console.error(err);
      throw err;
    }
  };

  // Update existing professional
  const updateProfessional = async (id: string, data: ProfessionalCreateForm): Promise<void> => {
    try {
      // Simulate API call
      setTimeout(() => {
        setProfessionals(
          professionals.map(p => 
            p.id === id ? { ...p, ...data } : p
          )
        );
      }, 500);
    } catch (err) {
      setError('Erro ao atualizar profissional');
      console.error(err);
      throw err;
    }
  };

  // Remove professional from the list
  const removeProfessional = async (id: string): Promise<void> => {
    try {
      // Simulate API call
      setTimeout(() => {
        setProfessionals(professionals.filter(p => p.id !== id));
      }, 500);
    } catch (err) {
      setError('Erro ao remover profissional');
      console.error(err);
      throw err;
    }
  };

  // Get professional by ID
  const getProfessionalById = (id: string): Professional | undefined => {
    return professionals.find(p => p.id === id);
  };

  // Load professionals on component mount
  useEffect(() => {
    fetchProfessionals();
  }, []);

  return {
    professionals,
    loading,
    error,
    fetchProfessionals,
    addProfessional,
    updateProfessional,
    removeProfessional,
    getProfessionalById,
    specialties
  };
};
