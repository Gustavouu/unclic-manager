
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
  
  // We need to handle File objects specially since they can't be directly serialized
  if (preparedData.logo instanceof File) {
    // Create a URL for the logo if it doesn't exist yet
    if (!preparedData.logoUrl) {
      preparedData.logoUrl = URL.createObjectURL(preparedData.logo);
    }
    // Store logo name for future reference
    preparedData.logoName = preparedData.logo.name;
    // Files can't be serialized to JSON, so set to null for storage
    preparedData.logo = null;
  }
  
  if (preparedData.banner instanceof File) {
    // Create a URL for the banner if it doesn't exist yet
    if (!preparedData.bannerUrl) {
      preparedData.bannerUrl = URL.createObjectURL(preparedData.banner);
    }
    // Store banner name for future reference
    preparedData.bannerName = preparedData.banner.name;
    // Files can't be serialized to JSON, so set to null for storage
    preparedData.banner = null;
  }
  
  return preparedData;
};

// Function to create object URLs for files
export const createFilePreview = (file: File | null): string | null => {
  if (!file) return null;
  
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Error creating file preview:", error);
    return null;
  }
};

// Function to safely revoke object URLs
export const revokeFilePreview = (url: string | null) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

// Helper function to serialize a File for storage (kept for compatibility)
export const serializeFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const serialized = JSON.stringify({
          type: file.type,
          name: file.name,
          lastModified: file.lastModified,
          data: reader.result.split(',')[1] // Remove o prefixo "data:MIME;base64,"
        });
        resolve(serialized);
      } else {
        reject(new Error('Falha ao ler o arquivo'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper function to deserialize a File from storage (kept for compatibility)
export const deserializeFile = (serialized: string): File | null => {
  try {
    const { type, name, lastModified, data } = JSON.parse(serialized);
    const binaryString = atob(data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new File([bytes.buffer], name, { type, lastModified });
  } catch (error) {
    console.error('Erro ao deserializar o arquivo:', error);
    return null;
  }
};
