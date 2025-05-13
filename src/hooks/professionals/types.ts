
export type Option = {
  label: string;
  value: string;
};

export type ProfessionalStatus = 'active' | 'inactive' | 'vacation' | 'leave';

export interface Professional {
  id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  photoUrl?: string;
  bio?: string;
  status: ProfessionalStatus;
  hireDate?: string;
  commissionPercentage?: number;
  userId?: string;
}

export interface ProfessionalCreateForm {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  photoUrl?: string;
  bio?: string;
  commissionPercentage?: number;
}
