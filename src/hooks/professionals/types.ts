
export * from "../../components/professionals/multiselect/types";

export type ProfessionalStatus = 'active' | 'inactive' | 'vacation' | 'leave';

export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  photoUrl?: string; // Added field to match usage in components
  role?: string; // Added field to match usage in components
  specialties?: string[]; // Added field to match usage in components
  commissionPercentage?: number; // Added field to match usage in components
  status?: ProfessionalStatus;
  establishmentId?: string;
  tenantId?: string;
  services?: string[];
  workingHours?: any; // This should be properly typed in the future
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  appointmentsCount?: number;
  revenueGenerated?: number;
  hireDate?: string;
  userId?: string;
}

export type ProfessionalCreateForm = Omit<
  Professional, 
  'id' | 'createdAt' | 'updatedAt' | 'appointmentsCount' | 'revenueGenerated'
>;

// Enhanced type for professionals hook related to security
export interface UseProfessionalsOptions {
  tenantIdOverride?: string;
  secureMode?: boolean; // Whether to enforce RLS policies in the frontend
  fetchPolicy?: 'cache-first' | 'network-only';
}

// Type for professionals hook return value
export interface UseProfessionalsReturn {
  professionals: Professional[];
  loading: boolean;
  error: Error | null;
  specialties?: string[]; // Added field to match usage in components
  isLoading?: boolean; // Added field to match usage in components
  refetch: () => Promise<void>;
  createProfessional: (data: ProfessionalCreateForm) => Promise<Professional | null>;
  updateProfessional: (id: string, data: Partial<Professional>) => Promise<boolean>;
  deleteProfessional: (id: string) => Promise<boolean>;
  getProfessionalById: (id: string) => Professional | undefined;
  // Adding these aliases to match usage in components
  addProfessional: (data: ProfessionalCreateForm) => Promise<Professional | null>;
  removeProfessional: (id: string) => Promise<boolean>;
}
