
// Professional type interfaces
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

export type ProfessionalStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

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
  
  // Adding missing properties and method aliases that were causing TypeScript errors
  addProfessional: (professional: ProfessionalCreateForm) => Promise<Professional>;
  removeProfessional: (id: string) => Promise<boolean>;
  isLoading: boolean;
  specialties: string[];
}
