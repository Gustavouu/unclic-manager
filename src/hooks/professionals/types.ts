
export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  specialties?: string[];
  status: 'ACTIVE' | 'INACTIVE';
  commissionPercentage?: number;
}

export type ProfessionalCreateForm = Omit<Professional, 'id' | 'status'> & {
  role?: string;
};

export const PROFESSIONAL_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
} as const;

export type ProfessionalStatus = keyof typeof PROFESSIONAL_STATUS;

export const STATUS_MAPPING = {
  ACTIVE: { label: 'Ativo', color: 'bg-green-100 text-green-800' },
  INACTIVE: { label: 'Inativo', color: 'bg-gray-100 text-gray-800' }
};

export interface Option {
  label: string;
  value: string;
}
