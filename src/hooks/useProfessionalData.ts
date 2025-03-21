import { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { DateRange } from "react-day-picker";

export type Professional = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialty: string;
  status: 'active' | 'inactive' | 'vacation';
  avatar?: string;
  hireDate: string | null;
  appointmentsCount: number;
  clientsServed: number;
  revenueGenerated: number;
  commission: number;
};

export type FilterOptions = {
  status: string[];
  role: string[];
  specialty: string[];
  dateRange?: DateRange | undefined;
};

// Mock data para demonstração
const initialProfessionals: Professional[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@exemplo.com",
    phone: "(11) 98765-4321",
    role: "Cabeleireira",
    specialty: "Coloração",
    status: "active",
    hireDate: "2022-01-15",
    appointmentsCount: 245,
    clientsServed: 178,
    revenueGenerated: 12500.00,
    commission: 25
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@exemplo.com",
    phone: "(11) 91234-5678",
    role: "Barbeiro",
    specialty: "Barba",
    status: "active",
    hireDate: "2022-03-10",
    appointmentsCount: 189,
    clientsServed: 145,
    revenueGenerated: 9800.00,
    commission: 30
  },
  {
    id: "3",
    name: "Juliana Mendes",
    email: "juliana.mendes@exemplo.com",
    phone: "(11) 99876-5432",
    role: "Esteticista",
    specialty: "Massagem",
    status: "vacation",
    hireDate: "2021-11-20",
    appointmentsCount: 310,
    clientsServed: 210,
    revenueGenerated: 15200.00,
    commission: 25
  },
  {
    id: "4",
    name: "Rafael Costa",
    email: "rafael.costa@exemplo.com",
    phone: "(11) 97654-3210",
    role: "Manicure",
    specialty: "Unhas em Gel",
    status: "inactive",
    hireDate: "2022-05-05",
    appointmentsCount: 178,
    clientsServed: 130,
    revenueGenerated: 8300.00,
    commission: 20
  },
  {
    id: "5",
    name: "Fernanda Lima",
    email: "fernanda.lima@exemplo.com",
    phone: "(11) 95432-1098",
    role: "Cabeleireira",
    specialty: "Penteados",
    status: "active",
    hireDate: "2021-09-12",
    appointmentsCount: 267,
    clientsServed: 190,
    revenueGenerated: 13500.00,
    commission: 25
  }
];

export const useProfessionalData = (searchTerm: string = "") => {
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: [],
    role: [],
    specialty: [],
    dateRange: undefined
  });

  // Calcular opções disponíveis para os filtros
  const availableFilterOptions = useMemo(() => {
    const statusOptions = Array.from(new Set(professionals.map(prof => prof.status)));
    const roleOptions = Array.from(new Set(professionals.map(prof => prof.role)));
    const specialtyOptions = Array.from(new Set(professionals.map(prof => prof.specialty)));

    return {
      status: statusOptions,
      role: roleOptions,
      specialty: specialtyOptions
    };
  }, [professionals]);

  // Aplicar filtros e pesquisa
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(professional => {
      // Aplicar pesquisa por termo
      const matchesSearchTerm = searchTerm === "" || 
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.phone.includes(searchTerm);

      // Aplicar filtros
      const matchesStatus = filterOptions.status.length === 0 || 
        filterOptions.status.includes(professional.status);
      const matchesRole = filterOptions.role.length === 0 || 
        filterOptions.role.includes(professional.role);
      const matchesSpecialty = filterOptions.specialty.length === 0 || 
        filterOptions.specialty.includes(professional.specialty);
      
      // Filter by date range if present
      const matchesDateRange = !filterOptions.dateRange?.from || !professional.hireDate 
        ? true 
        : new Date(professional.hireDate) >= filterOptions.dateRange.from && 
          (!filterOptions.dateRange.to || new Date(professional.hireDate) <= filterOptions.dateRange.to);

      return matchesSearchTerm && matchesStatus && matchesRole && matchesSpecialty && matchesDateRange;
    });
  }, [professionals, searchTerm, filterOptions]);

  // Funções para manipular profissionais
  const addProfessional = (professional: Omit<Professional, "id" | "appointmentsCount" | "clientsServed" | "revenueGenerated">) => {
    const newProfessional: Professional = {
      ...professional,
      id: uuidv4(),
      appointmentsCount: 0,
      clientsServed: 0,
      revenueGenerated: 0
    };
    setProfessionals(prev => [...prev, newProfessional]);
  };

  const updateProfessional = (id: string, updatedData: Partial<Professional>) => {
    setProfessionals(prev => 
      prev.map(prof => prof.id === id ? { ...prof, ...updatedData } : prof)
    );
  };

  const deleteProfessional = (id: string) => {
    setProfessionals(prev => prev.filter(prof => prof.id !== id));
  };

  const updateFilterOptions = (newOptions: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({ ...prev, ...newOptions }));
  };

  return {
    professionals,
    filteredProfessionals,
    availableFilterOptions,
    filterOptions,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    updateFilterOptions
  };
};
