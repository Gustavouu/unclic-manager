
export * from "../../components/professionals/multiselect/types";

export type ProfessionalStatus = 'active' | 'inactive' | 'vacation' | 'leave';

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
  workingHours?: any; // This should be properly typed in the future
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  appointmentsCount?: number;
  revenueGenerated?: number;
  // Add the missing properties that are used in the codebase
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
  refetch: () => Promise<void>;
  createProfessional: (data: ProfessionalCreateForm) => Promise<Professional | null>;
  updateProfessional: (id: string, data: Partial<Professional>) => Promise<boolean>;
  deleteProfessional: (id: string) => Promise<boolean>;
  getProfessionalById: (id: string) => Professional | undefined;
}
