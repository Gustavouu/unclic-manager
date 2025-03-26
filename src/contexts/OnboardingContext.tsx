
import React, { createContext, useState, useContext, ReactNode } from "react";

// Tipos para os dados do estabelecimento
export interface BusinessData {
  name: string;
  email: string;
  phone: string;
  logo?: File | null;
  banner?: File | null;
  cep: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Tipo para os serviços
export interface ServiceData {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
}

// Tipo para os funcionários
export interface StaffData {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  specialties?: string[];
}

// Tipo para os horários de funcionamento
export interface BusinessHours {
  [day: string]: {
    open: boolean;
    openTime: string;
    closeTime: string;
  };
}

// Interface do contexto
interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  businessData: BusinessData;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  services: ServiceData[];
  addService: (service: ServiceData) => void;
  removeService: (id: string) => void;
  updateService: (id: string, data: Partial<ServiceData>) => void;
  staffMembers: StaffData[];
  addStaffMember: (staff: StaffData) => void;
  removeStaffMember: (id: string) => void;
  updateStaffMember: (id: string, data: Partial<StaffData>) => void;
  businessHours: BusinessHours;
  updateBusinessHours: (day: string, data: Partial<BusinessHours[string]>) => void;
  hasStaff: boolean;
  setHasStaff: (value: boolean) => void;
  isComplete: () => boolean;
  saveProgress: () => void;
  loadProgress: () => void;
}

// Valores iniciais
const initialBusinessData: BusinessData = {
  name: "",
  email: "",
  phone: "",
  logo: null,
  banner: null,
  cep: "",
  address: "",
  number: "",
  neighborhood: "",
  city: "",
  state: ""
};

const initialBusinessHours: BusinessHours = {
  monday: { open: true, openTime: "09:00", closeTime: "18:00" },
  tuesday: { open: true, openTime: "09:00", closeTime: "18:00" },
  wednesday: { open: true, openTime: "09:00", closeTime: "18:00" },
  thursday: { open: true, openTime: "09:00", closeTime: "18:00" },
  friday: { open: true, openTime: "09:00", closeTime: "18:00" },
  saturday: { open: true, openTime: "09:00", closeTime: "13:00" },
  sunday: { open: false, openTime: "09:00", closeTime: "18:00" }
};

// Criação do contexto
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Provider do contexto
export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [businessData, setBusinessData] = useState<BusinessData>(initialBusinessData);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffData[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours>(initialBusinessHours);
  const [hasStaff, setHasStaff] = useState<boolean>(false);

  // Atualiza os dados do estabelecimento
  const updateBusinessData = (data: Partial<BusinessData>) => {
    setBusinessData(prev => ({ ...prev, ...data }));
  };

  // Funções para gerenciar serviços
  const addService = (service: ServiceData) => {
    setServices(prev => [...prev, service]);
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const updateService = (id: string, data: Partial<ServiceData>) => {
    setServices(prev => 
      prev.map(service => service.id === id ? { ...service, ...data } : service)
    );
  };

  // Funções para gerenciar funcionários
  const addStaffMember = (staff: StaffData) => {
    setStaffMembers(prev => [...prev, staff]);
  };

  const removeStaffMember = (id: string) => {
    setStaffMembers(prev => prev.filter(staff => staff.id !== id));
  };

  const updateStaffMember = (id: string, data: Partial<StaffData>) => {
    setStaffMembers(prev => 
      prev.map(staff => staff.id === id ? { ...staff, ...data } : staff)
    );
  };

  // Atualiza os horários de funcionamento
  const updateBusinessHours = (day: string, data: Partial<BusinessHours[string]>) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], ...data }
    }));
  };

  // Verifica se todas as informações obrigatórias foram preenchidas
  const isComplete = () => {
    // Verificar dados básicos do negócio
    const businessComplete = 
      businessData.name.trim() !== "" && 
      businessData.email.trim() !== "" && 
      businessData.phone.trim() !== "" &&
      businessData.cep.trim() !== "" &&
      businessData.address.trim() !== "" &&
      businessData.number.trim() !== "" &&
      businessData.neighborhood.trim() !== "" &&
      businessData.city.trim() !== "" &&
      businessData.state.trim() !== "";
    
    // Verificar se há pelo menos um serviço
    const servicesComplete = services.length > 0;
    
    // Verificar funcionários apenas se o negócio tiver funcionários
    const staffComplete = !hasStaff || (hasStaff && staffMembers.length > 0);
    
    return businessComplete && servicesComplete && staffComplete;
  };

  // Salva o progresso no localStorage
  const saveProgress = () => {
    const data = {
      businessData: { ...businessData, logo: null, banner: null }, // Não é possível salvar arquivos no localStorage
      services,
      staffMembers,
      businessHours,
      hasStaff,
      currentStep
    };
    
    localStorage.setItem('onboardingData', JSON.stringify(data));
  };

  // Carrega o progresso do localStorage
  const loadProgress = () => {
    const savedData = localStorage.getItem('onboardingData');
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setBusinessData(prev => ({ ...prev, ...parsed.businessData }));
        setServices(parsed.services || []);
        setStaffMembers(parsed.staffMembers || []);
        setBusinessHours(parsed.businessHours || initialBusinessHours);
        setHasStaff(parsed.hasStaff || false);
        setCurrentStep(parsed.currentStep || 0);
      } catch (error) {
        console.error("Erro ao carregar dados do onboarding:", error);
      }
    }
  };

  return (
    <OnboardingContext.Provider value={{
      currentStep,
      setCurrentStep,
      businessData,
      updateBusinessData,
      services,
      addService,
      removeService,
      updateService,
      staffMembers,
      addStaffMember,
      removeStaffMember,
      updateStaffMember,
      businessHours,
      updateBusinessHours,
      hasStaff,
      setHasStaff,
      isComplete,
      saveProgress,
      loadProgress
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Hook para usar o contexto
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  
  if (context === undefined) {
    throw new Error("useOnboarding deve ser usado dentro de um OnboardingProvider");
  }
  
  return context;
};
