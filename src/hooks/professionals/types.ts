
export * from "../../components/professionals/multiselect/types";

export type ProfessionalStatus = 'active' | 'inactive';

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
}

export type ProfessionalCreateForm = Omit<
  Professional,
  'id' | 'status' | 'createdAt' | 'updatedAt' | 'appointmentsCount' | 'revenueGenerated'
>;
