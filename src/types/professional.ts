
export interface Professional {
  id: string;
  id_negocio: string;
  nome: string;
  email?: string;
  telefone?: string;
  cargo?: string;
  bio?: string;
  foto_url?: string;
  especializacoes?: string[];
  comissao_percentual?: number;
  data_contratacao?: string;
  status: string;
  criado_em: string;
  atualizado_em: string;
  // English aliases for compatibility
  business_id?: string;
  name?: string;
  phone?: string;
  position?: string;
  photo_url?: string;
  specialties?: string[];
  commission_percentage?: number;
  hire_date?: string;
  created_at?: string;
  updated_at?: string;
  rating?: number;
  total_reviews?: number;
}

export interface ProfessionalFormData {
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
}

export interface ProfessionalCreate extends ProfessionalFormData {
  business_id: string;
}

export interface ProfessionalUpdate extends Partial<ProfessionalFormData> {}

export interface ProfessionalSearchParams {
  business_id: string;
  status?: string;
  specialty?: string;
  rating?: number;
  search?: string;
}

export interface ProfessionalStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  averageRating: number;
  totalRevenue: number;
  mostPopularService: string;
  busiestDay: string;
  busiestTime: string;
}

export interface ProfessionalAvailability {
  date: string;
  available_slots: Array<{
    start: string;
    end: string;
  }>;
  unavailable_slots: Array<{
    start: string;
    end: string;
  }>;
}
