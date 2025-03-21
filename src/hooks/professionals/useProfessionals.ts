
import { useState, useCallback, useMemo } from "react";
import { Professional, ProfessionalCreateForm, ProfessionalStatus } from "./types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

// Dados mockados para exemplo
const initialProfessionals: Professional[] = [
  {
    id: "p1",
    name: "Ana Lúcia Pereira",
    role: "Cabeleireira Master",
    email: "ana.lucia@salon.com",
    phone: "(11) 98765-4321",
    specialties: ["Corte feminino", "Coloração", "Escova progressiva"],
    photoUrl: "https://i.pravatar.cc/150?img=5",
    bio: "Ana tem mais de 15 anos de experiência em salões de alto padrão.",
    status: "active",
    hireDate: "2019-05-10",
    commissionPercentage: 40,
    userId: "u1"
  },
  {
    id: "p2",
    name: "Carlos Eduardo Santos",
    role: "Barbeiro",
    email: "carlos.santos@salon.com",
    phone: "(11) 98321-6754",
    specialties: ["Corte masculino", "Barba", "Sobrancelha"],
    photoUrl: "https://i.pravatar.cc/150?img=12",
    bio: "Especialista em cortes modernos e barbas estilizadas.",
    status: "active",
    hireDate: "2020-02-15",
    commissionPercentage: 35,
    userId: "u2"
  },
  {
    id: "p3",
    name: "Mariana Costa",
    role: "Esteticista",
    email: "mariana.costa@salon.com",
    phone: "(11) 97890-1234",
    specialties: ["Limpeza de pele", "Massagem facial", "Peeling"],
    photoUrl: "https://i.pravatar.cc/150?img=9",
    bio: "Especializada em tratamentos faciais e corporais rejuvenescedores.",
    status: "vacation",
    hireDate: "2021-10-01",
    commissionPercentage: 30,
    userId: "u3"
  },
  {
    id: "p4",
    name: "Roberto Almeida",
    role: "Nail Designer",
    email: "roberto.almeida@salon.com",
    phone: "(11) 99876-5432",
    specialties: ["Manicure", "Pedicure", "Unhas em gel"],
    photoUrl: "https://i.pravatar.cc/150?img=11",
    bio: "Especialista em design de unhas e técnicas artísticas.",
    status: "leave",
    hireDate: "2022-03-20",
    commissionPercentage: 30,
    userId: "u4"
  },
  {
    id: "p5",
    name: "Fernanda Lima",
    role: "Maquiadora",
    email: "fernanda.lima@salon.com",
    phone: "(11) 99765-4321",
    specialties: ["Maquiagem social", "Maquiagem artística", "Penteados"],
    photoUrl: "https://i.pravatar.cc/150?img=1",
    bio: "Maquiadora profissional com experiência em eventos e produções.",
    status: "active",
    hireDate: "2022-01-15",
    commissionPercentage: 35,
    userId: "u5"
  },
  {
    id: "p6",
    name: "Paulo Henrique",
    role: "Massagista",
    email: "paulo.henrique@salon.com",
    phone: "(11) 98432-1765",
    specialties: ["Massagem relaxante", "Massagem terapêutica", "Drenagem linfática"],
    photoUrl: "https://i.pravatar.cc/150?img=15",
    bio: "Profissional com formação em técnicas de massagem oriental e ocidental.",
    status: "inactive",
    hireDate: "2020-08-10",
    commissionPercentage: 40,
    userId: "u6"
  }
];

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Lista de todas as especialidades
  const specialties = useMemo(() => {
    const allSpecialties = professionals.flatMap(p => p.specialties);
    return [...new Set(allSpecialties)];
  }, [professionals]);
  
  // Buscar profissional por ID
  const getProfessionalById = useCallback((id: string) => {
    return professionals.find(p => p.id === id);
  }, [professionals]);
  
  // Adicionar novo profissional
  const addProfessional = useCallback(async (data: ProfessionalCreateForm) => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProfessional: Professional = {
        id: uuidv4(),
        name: data.name,
        role: data.role,
        email: data.email,
        phone: data.phone,
        specialties: data.specialties,
        bio: data.bio,
        status: "active",
        commissionPercentage: data.commissionPercentage || 0,
        hireDate: new Date().toISOString().split('T')[0]
      };
      
      setProfessionals(prev => [...prev, newProfessional]);
      
      toast({
        title: "Colaborador adicionado",
        description: `${data.name} foi adicionado com sucesso!`
      });
      
      return newProfessional;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o colaborador.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Atualizar profissional
  const updateProfessional = useCallback(async (id: string, data: Partial<Professional>) => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfessionals(prev => 
        prev.map(p => p.id === id ? { ...p, ...data } : p)
      );
      
      toast({
        title: "Colaborador atualizado",
        description: "As informações foram atualizadas com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o colaborador.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Atualizar status do profissional
  const updateProfessionalStatus = useCallback(async (id: string, status: ProfessionalStatus) => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfessionals(prev => 
        prev.map(p => p.id === id ? { ...p, status } : p)
      );
      
      const statusLabels = {
        active: "Ativo",
        vacation: "De férias",
        leave: "Licença",
        inactive: "Inativo"
      };
      
      toast({
        title: "Status atualizado",
        description: `Colaborador agora está: ${statusLabels[status]}`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Remover profissional
  const removeProfessional = useCallback(async (id: string) => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const professional = professionals.find(p => p.id === id);
      setProfessionals(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Colaborador removido",
        description: `${professional?.name} foi removido com sucesso!`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o colaborador.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [professionals, toast]);
  
  return {
    professionals,
    isLoading,
    specialties,
    getProfessionalById,
    addProfessional,
    updateProfessional,
    updateProfessionalStatus,
    removeProfessional
  };
};
