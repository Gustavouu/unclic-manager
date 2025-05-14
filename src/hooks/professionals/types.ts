
export interface ProfessionalData {
  id: string;
  business_id: string;
  user_id?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  specialties?: string[] | null;
  commission_percentage?: number | null;
  hire_date?: string | null;
  status?: string | null;
  working_hours?: any | null;
  created_at?: string;
  updated_at?: string;
}

// Add an alias for backward compatibility
export type Professional = ProfessionalData;

export interface ProfessionalFormData {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  photo_url?: string;
  specialties?: string[];
  commission_percentage?: number;
  hire_date?: string;
  status?: string;
  working_hours?: any;
}

export enum ProfessionalStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE"
}

export const PROFESSIONAL_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ON_LEAVE: "ON_LEAVE"
};

export const STATUS_MAPPING = {
  [ProfessionalStatus.ACTIVE]: "Ativo",
  [ProfessionalStatus.INACTIVE]: "Inativo",
  [ProfessionalStatus.ON_LEAVE]: "Licença"
};

export interface UseProfessionalsResult {
  professionals: ProfessionalData[];
  loading: boolean;
  error: string | null;
  fetchProfessionals: () => Promise<void>;
  getProfessionalById: (id: string) => ProfessionalData | undefined;
}

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show"
}

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: "scheduled", label: "Agendado" },
  { value: "confirmed", label: "Confirmado" },
  { value: "in_progress", label: "Em andamento" },
  { value: "completed", label: "Concluído" },
  { value: "cancelled", label: "Cancelado" },
  { value: "no_show", label: "Não compareceu" }
];

export const APPOINTMENT_STATUS_RECORD = {
  scheduled: "Agendado",
  confirmed: "Confirmado",
  in_progress: "Em andamento",
  completed: "Concluído",
  cancelled: "Cancelado",
  no_show: "Não compareceu"
};
