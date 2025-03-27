
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
  
  // Handle logo file - convert to base64 if needed
  if (preparedData.logo instanceof File) {
    if (!preparedData.logoData) {
      // Convert file to base64 for storage
      fileToBase64(preparedData.logo).then(base64 => {
        preparedData.logoData = base64;
      }).catch(err => {
        console.error("Error converting logo to base64:", err);
      });
    }
    
    // Store metadata
    preparedData.logoName = preparedData.logo.name;
    
    // Create URL for preview if doesn't exist
    if (!preparedData.logoUrl) {
      preparedData.logoUrl = URL.createObjectURL(preparedData.logo);
    }
    
    // Files can't be serialized, so set to null for storage
    preparedData.logo = null;
  }
  
  // Handle banner file - convert to base64 if needed
  if (preparedData.banner instanceof File) {
    if (!preparedData.bannerData) {
      // Convert file to base64 for storage
      fileToBase64(preparedData.banner).then(base64 => {
        preparedData.bannerData = base64;
      }).catch(err => {
        console.error("Error converting banner to base64:", err);
      });
    }
    
    // Store metadata
    preparedData.bannerName = preparedData.banner.name;
    
    // Create URL for preview if doesn't exist
    if (!preparedData.bannerUrl) {
      preparedData.bannerUrl = URL.createObjectURL(preparedData.banner);
    }
    
    // Files can't be serialized, so set to null for storage
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
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error revoking URL:", error);
    }
  }
};

// Convert file to base64 string
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Convert base64 string to File object
export const base64ToFile = (base64: string, filename: string): File | null => {
  try {
    // Extract MIME type from base64 string
    const mimeMatch = base64.match(/data:([^;]+);base64,/);
    if (!mimeMatch) return null;
    
    const mime = mimeMatch[1];
    const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
    
    // Convert base64 to binary
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type: mime });
    return new File([blob], filename, { type: mime });
  } catch (error) {
    console.error("Error converting base64 to file:", error);
    return null;
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
