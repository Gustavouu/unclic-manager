
import { useState } from "react";
import { 
  BusinessData, 
  ServiceData, 
  StaffData, 
  BusinessHours 
} from "./types";
import { initialBusinessData, initialBusinessHours } from "./initialValues";
import { checkOnboardingComplete, prepareDataForStorage, serializeFile, deserializeFile } from "./utils";

export const useOnboardingState = () => {
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
    return checkOnboardingComplete(businessData, services, staffMembers, hasStaff);
  };

  // Salva o progresso no localStorage
  const saveProgress = () => {
    const data = {
      businessData: prepareDataForStorage(businessData),
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
        // Deserialize logo and banner if they exist
        const loadedBusinessData = { ...parsed.businessData };
        
        setBusinessData(prev => ({ ...prev, ...loadedBusinessData }));
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

  return {
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
  };
};
