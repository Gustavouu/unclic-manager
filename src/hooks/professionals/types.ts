
export * from "../../components/professionals/multiselect/types";

export type ProfessionalStatus = 'active' | 'inactive' | 'vacation' | 'leave';

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  bio?: string;
  specialties?: string[];
  commissionPercentage: number;
  status?: ProfessionalStatus;
  photoUrl?: string;
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
  'id' | 'status' | 'createdAt' | 'updatedAt' | 'appointmentsCount' | 'revenueGenerated'
>;
