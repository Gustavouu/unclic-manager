
export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  photo_url?: string;
  bio?: string;
  specialties?: string[];
  status?: ProfessionalStatus;
  business_id?: string;
  user_id?: string;
  commission_percentage?: number;
}

// Define as enum for type safety and value access
export enum ProfessionalStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'vacation',
  PENDING = 'pending'
}

// For backward compatibility
export const PROFESSIONAL_STATUS = {
  ACTIVE: ProfessionalStatus.ACTIVE,
  INACTIVE: ProfessionalStatus.INACTIVE,
  ON_LEAVE: ProfessionalStatus.ON_LEAVE,
  PENDING: ProfessionalStatus.PENDING
};

export const STATUS_MAPPING = {
  [ProfessionalStatus.ACTIVE]: {
    label: 'Ativo',
    color: 'green'
  },
  [ProfessionalStatus.INACTIVE]: {
    label: 'Inativo',
    color: 'red'
  },
  [ProfessionalStatus.ON_LEAVE]: {
    label: 'Férias',
    color: 'amber'
  },
  [ProfessionalStatus.PENDING]: {
    label: 'Pendente',
    color: 'blue'
  }
};

// Define and export AppointmentStatus type and constants
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
};

export const APPOINTMENT_STATUS_RECORD = {
  scheduled: {
    label: 'Agendado',
    color: 'blue'
  },
  confirmed: {
    label: 'Confirmado',
    color: 'green'
  },
  completed: {
    label: 'Concluído',
    color: 'green'
  },
  cancelled: {
    label: 'Cancelado',
    color: 'red'
  },
  no_show: {
    label: 'Não compareceu',
    color: 'amber'
  }
};

export interface Option {
  value: string;
  label: string;
}

// Add ProfessionalFormData interface that is missing but referenced in other files
export interface ProfessionalFormData {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  photo_url?: string;
  bio?: string;
  specialties?: string[];
  status: ProfessionalStatus;
  business_id?: string;
  user_id?: string;
  commission_percentage?: number;
  hire_date?: string;
  working_hours?: any;
}
