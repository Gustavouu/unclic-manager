
import { BusinessData, ServiceData, StaffData } from "../types";

/**
 * Checks if all required onboarding data is complete
 */
export const checkOnboardingComplete = (
  businessData: BusinessData,
  services: ServiceData[],
  staffMembers: StaffData[],
  hasStaff: boolean
): boolean => {
  // Verifica se os dados do negócio estão preenchidos
  const businessComplete = 
    !!businessData.name && 
    !!businessData.email && 
    !!businessData.phone;
  
  // Verifica se pelo menos um serviço foi adicionado
  const servicesComplete = services.length > 0;
  
  // Verifica se há funcionários ou se o usuário indicou que não tem funcionários
  const staffComplete = !hasStaff || (hasStaff && staffMembers.length > 0);
  
  return businessComplete && servicesComplete && staffComplete;
};
