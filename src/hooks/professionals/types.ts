
export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  specialties?: string[];
  status: ProfessionalStatus;
  commissionPercentage?: number;
  role?: string;
}

export type ProfessionalCreateForm = Omit<Professional, 'id' | 'status'> & {
  role?: string;
};

export enum ProfessionalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE'
}

export const PROFESSIONAL_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ON_LEAVE: 'ON_LEAVE'
} as const;

export type ProfessionalStatusType = keyof typeof PROFESSIONAL_STATUS;

export const STATUS_MAPPING = {
  ACTIVE: { label: 'Ativo', color: 'bg-green-100 text-green-800' },
  INACTIVE: { label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
  ON_LEAVE: { label: 'Ausente', color: 'bg-amber-100 text-amber-800' }
};

export interface Option {
  label: string;
  value: string;
}
