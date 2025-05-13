
// Standard type interface for professionals data
export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  specialties?: string[];
  position?: string;
  status?: string;
  isActive?: boolean;
  commission_percentage?: number;
  hire_date?: string | Date;
  business_id: string;
  user_id?: string;
  workingHours?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  
  // Added fields to handle legacy properties and new ones
  photoUrl?: string;
  role?: string;
  hireDate?: string | Date;
  commissionPercentage?: number;
  userId?: string;
}

// Input type for creating/updating a professional
export interface ProfessionalInput {
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  specialties?: string[];
  position?: string;
  commission_percentage?: number;
  workingHours?: Record<string, any>;
}

// This is the form type used by components for editing/creating professionals
export interface ProfessionalCreateForm {
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
  avatar?: string;
  specialties?: string[];
  position?: string;
  role?: string;
  status?: ProfessionalStatus;
  commissionPercentage?: number;
  commission_percentage?: number;
}

// Filter options for fetching professionals
export interface ProfessionalFilters {
  isActive?: boolean;
  specialties?: string[];
  search?: string;
}

// Professional status enum
export enum ProfessionalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
}

// Export constant for easy reference
export const PROFESSIONAL_STATUS = ProfessionalStatus;

// Mapping for legacy status values to new enum
export const STATUS_MAPPING = {
  'active': ProfessionalStatus.ACTIVE,
  'inactive': ProfessionalStatus.INACTIVE,
  'vacation': ProfessionalStatus.ON_LEAVE,
  'leave': ProfessionalStatus.ON_LEAVE,
};

// Client type definition to support both old and new field naming
export interface Client {
  id: string;
  name?: string; 
  nome?: string; // legacy
  email?: string;
  phone?: string;
  telefone?: string; // legacy
  birth_date?: string;
  data_nascimento?: string; // legacy
  gender?: string;
  genero?: string; // legacy
  address?: string;
  endereco?: string; // legacy
  city?: string;
  cidade?: string; // legacy
  state?: string;
  estado?: string; // legacy
  zip_code?: string;
  cep?: string; // legacy
  notes?: string;
  notas?: string; // legacy
  total_spent?: number;
  valor_total_gasto?: number; // legacy
  last_visit?: string;
  ultima_visita?: string; // legacy
  preferences?: Record<string, any>;
  preferencias?: Record<string, any>; // legacy
  total_appointments?: number;
  total_agendamentos?: number; // legacy
  created_at?: string;
  criado_em?: string; // legacy
  updated_at?: string;
  atualizado_em?: string; // legacy
  business_id?: string;
  id_negocio?: string; // legacy
}
