
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

export interface UseProfessionalsResult {
  professionals: ProfessionalData[];
  loading: boolean;
  error: string | null;
  fetchProfessionals: () => Promise<void>;
  getProfessionalById: (id: string) => ProfessionalData | undefined;
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
