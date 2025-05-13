
// Professional type interfaces
export type ProfessionalStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

// Add lowercase status constants for backward compatibility with existing code
export const PROFESSIONAL_STATUS = {
  ACTIVE: 'ACTIVE' as ProfessionalStatus,
  INACTIVE: 'INACTIVE' as ProfessionalStatus,
  ON_LEAVE: 'ON_LEAVE' as ProfessionalStatus,
};

export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  status?: ProfessionalStatus;
  establishmentId?: string;
  tenantId?: string;
  services?: string[];
  workingHours?: any;
  isActive?: boolean;
  hireDate?: string;
  userId?: string;
  
  // Adding missing properties that were causing TypeScript errors
  role?: string;
  photoUrl?: string; 
  specialties?: string[];
  commissionPercentage?: number;
}

export interface ProfessionalCreateForm {
  name?: string;
  email?: string; 
  phone?: string;
  bio?: string;
  avatar?: string;
  status?: ProfessionalStatus;
  establishmentId?: string;
  tenantId?: string;
  services?: string[];
  workingHours?: any;
  isActive?: boolean;
  hireDate?: string;
  userId?: string;
  
  // Adding missing properties that were causing TypeScript errors
  role?: string;
  specialties?: string[];
  commissionPercentage?: number;
  photoUrl?: string;
}

export interface UseProfessionalsReturn {
  professionals: Professional[];
  loading: boolean;
  error: Error | null;
  createProfessional: (professional: ProfessionalCreateForm) => Promise<Professional>;
  updateProfessional: (id: string, professional: Partial<Professional>) => Promise<Professional>;
  deleteProfessional: (id: string) => Promise<boolean>;
  
  // Adding necessary methods for the rest of the application
  addProfessional: (professional: ProfessionalCreateForm) => Promise<Professional>;
  removeProfessional: (id: string) => Promise<boolean>;
  isLoading: boolean;
  specialties: string[];
  getProfessionalById?: (id: string) => Professional | undefined;
}
