
import { BusinessData, ServiceData, StaffData } from "./types";

// Check if all required fields are complete
export const isBusinessDataComplete = (businessData: BusinessData): boolean => {
  return (
    businessData.name.trim() !== "" && 
    businessData.email.trim() !== "" && 
    businessData.phone.trim() !== "" &&
    businessData.cep.trim() !== "" &&
    businessData.address.trim() !== "" &&
    businessData.number.trim() !== "" &&
    businessData.neighborhood.trim() !== "" &&
    businessData.city.trim() !== "" &&
    businessData.state.trim() !== ""
  );
};

// Prepare data for local storage (removing files which can't be stored)
export const prepareDataForStorage = (businessData: BusinessData) => {
  return { 
    ...businessData, 
    logo: null, 
    banner: null 
  };
};

// Check if the onboarding is complete
export const checkOnboardingComplete = (
  businessData: BusinessData,
  services: ServiceData[],
  staffMembers: StaffData[],
  hasStaff: boolean
): boolean => {
  // Verificar dados básicos do negócio
  const businessComplete = isBusinessDataComplete(businessData);
  
  // Verificar se há pelo menos um serviço
  const servicesComplete = services.length > 0;
  
  // Verificar funcionários apenas se o negócio tiver funcionários
  const staffComplete = !hasStaff || (hasStaff && staffMembers.length > 0);
  
  return businessComplete && servicesComplete && staffComplete;
};
