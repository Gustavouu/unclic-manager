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

export type ProfessionalStatus = 'active' | 'inactive' | 'vacation' | 'pending';

export const PROFESSIONAL_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  VACATION: 'vacation',
  PENDING: 'pending'
};

export const STATUS_MAPPING = {
  active: {
    label: 'Ativo',
    color: 'green'
  },
  inactive: {
    label: 'Inativo',
    color: 'red'
  },
  vacation: {
    label: 'Férias',
    color: 'amber'
  },
  pending: {
    label: 'Pendente',
    color: 'blue'
  }
};

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

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
