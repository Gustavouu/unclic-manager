
import { useState, useEffect, useCallback } from 'react';
import { Professional, ProfessionalCreateForm, ProfessionalStatus } from './types';
import { v4 as uuidv4 } from 'uuid';

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfessionals = useCallback(async () => {
    setLoading(true);
    try {
      // For now, simulate loading from an API
      setTimeout(() => {
        const mockProfessionals: Professional[] = [
          {
            id: '1',
            name: 'Carlos Santos',
            email: 'carlos@example.com',
            phone: '(11) 98765-4321',
            photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
            bio: 'Especialista em cortes masculinos com mais de 10 anos de experiência.',
            specialties: ['Corte Masculino', 'Barba'],
            status: ProfessionalStatus.ACTIVE,
            commissionPercentage: 50,
            role: 'Barbeiro'
          },
          {
            id: '2',
            name: 'Ana Oliveira',
            email: 'ana@example.com',
            phone: '(11) 98765-4322',
            photoUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
            bio: 'Especializada em coloração e tratamentos capilares.',
            specialties: ['Coloração', 'Tratamentos'],
            status: ProfessionalStatus.ACTIVE,
            commissionPercentage: 45,
            role: 'Cabeleireira'
          },
          {
            id: '3',
            name: 'Pedro Mendes',
            email: 'pedro@example.com',
            phone: '(11) 98765-4323',
            photoUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
            bio: 'Especialista em cortes modernos e penteados para eventos.',
            specialties: ['Corte Masculino', 'Penteados'],
            status: ProfessionalStatus.INACTIVE,
            commissionPercentage: 40,
            role: 'Barbeiro'
          }
        ];
        setProfessionals(mockProfessionals);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Erro ao carregar profissionais');
      setLoading(false);
    }
  }, []);

  // Add a new professional
  const addProfessional = async (professional: ProfessionalCreateForm) => {
    try {
      // In a real app, this would be an API call
      const newProfessional: Professional = {
        ...professional,
        id: uuidv4(),
        status: ProfessionalStatus.ACTIVE
      };
      
      setProfessionals(prev => [...prev, newProfessional]);
      return newProfessional;
    } catch (err) {
      setError('Erro ao adicionar profissional');
      throw err;
    }
  };

  // Update a professional
  const updateProfessional = async (id: string, data: ProfessionalCreateForm) => {
    try {
      // In a real app, this would be an API call
      const updatedProfessionals = professionals.map(p => 
        p.id === id ? { ...p, ...data, id } : p
      );
      
      setProfessionals(updatedProfessionals);
      return updatedProfessionals.find(p => p.id === id);
    } catch (err) {
      setError('Erro ao atualizar profissional');
      throw err;
    }
  };

  // Remove a professional
  const removeProfessional = async (id: string) => {
    try {
      // In a real app, this would be an API call
      const updatedProfessionals = professionals.filter(p => p.id !== id);
      setProfessionals(updatedProfessionals);
      return true;
    } catch (err) {
      setError('Erro ao remover profissional');
      throw err;
    }
  };

  // Get professional by id
  const getProfessionalById = (id: string) => {
    return professionals.find(p => p.id === id);
  };

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  return { 
    professionals, 
    loading, 
    isLoading: loading,
    error, 
    fetchProfessionals,
    addProfessional,
    updateProfessional,
    removeProfessional,
    getProfessionalById
  };
};
