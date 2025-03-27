
import { BusinessData, ServiceData, StaffData } from "./types";

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

export const prepareDataForStorage = (data: BusinessData): Partial<BusinessData> => {
  // Cria uma cópia para não modificar o original
  const preparedData = { ...data };
  
  // Remove os objetos File que não podem ser armazenados no localStorage
  // Não removemos completamente para manter a estrutura do objeto
  if (preparedData.logo instanceof File) {
    // No localStorage não podemos guardar o File, então marcamos como null
    preparedData.logo = null;
  }
  
  if (preparedData.banner instanceof File) {
    // No localStorage não podemos guardar o File, então marcamos como null
    preparedData.banner = null;
  }
  
  return preparedData;
};
