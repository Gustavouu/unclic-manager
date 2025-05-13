
export interface Professional {
  id: string;
  tenantId?: string;
  business_id?: string;
  id_negocio?: string;
  userId?: string;
  user_id?: string;
  establishmentId?: string;
  name: string;
  nome?: string;
  email?: string;
  phone?: string;
  telefone?: string;
  bio?: string;
  avatar?: string;
  foto_url?: string;
  isActive?: boolean;
  ativo?: boolean;
  workingHours?: any;
  horarios_trabalho?: any;
  hire_date?: string | Date;
  hireDate?: string | Date;
  data_contratacao?: string | Date;
  commission_percentage?: number;
  comissao_percentual?: number;
  specialties?: string[];
  especializacoes?: string[];
  position?: string;
  cargo?: string;
  createdAt?: string | Date;
  criado_em?: string | Date;
  updatedAt?: string | Date;
  atualizado_em?: string | Date;
  // Backward compatibility fields
  role?: string;
  photoUrl?: string;
  photo_url?: string; // Add this field to match error messages
  status?: ProfessionalStatus;
  commissionPercentage?: number;
}

export type ProfessionalFormData = {
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  position?: string;
  specialties?: string[];
  commission_percentage?: number;
  avatar?: string;
  isActive?: boolean;
  status?: ProfessionalStatus;
  role?: string; // For backwards compatibility
  photo_url?: string; // Add to match the error messages
  photoUrl?: string; // For backwards compatibility
  commissionPercentage?: number; // For backwards compatibility
};

export type ProfessionalCreateForm = ProfessionalFormData;

export enum ProfessionalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE'
}

export const STATUS_MAPPING = {
  'active': ProfessionalStatus.ACTIVE,
  'inactive': ProfessionalStatus.INACTIVE,
  'vacation': ProfessionalStatus.ON_LEAVE,
  'leave': ProfessionalStatus.ON_LEAVE,
  'ativo': ProfessionalStatus.ACTIVE,
  'inativo': ProfessionalStatus.INACTIVE,
  'ferias': ProfessionalStatus.ON_LEAVE
};

export const PROFESSIONAL_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'vacation'
};

// Add appointment status types to fix the error in useAppointmentCreate.ts
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export const APPOINTMENT_STATUS_RECORD: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: 'scheduled',
  [AppointmentStatus.CONFIRMED]: 'confirmed',
  [AppointmentStatus.COMPLETED]: 'completed',
  [AppointmentStatus.CANCELLED]: 'cancelled',
  [AppointmentStatus.NO_SHOW]: 'no_show'
};
