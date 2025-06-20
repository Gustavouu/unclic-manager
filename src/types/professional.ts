
export interface Professional {
  id: string;
  business_id?: string;
  id_negocio?: string;
  name?: string;
  nome?: string;
  email?: string;
  phone?: string;
  telefone?: string;
  position?: string;
  cargo?: string;
  bio?: string;
  photo_url?: string;
  foto_url?: string;
  specialties?: string[];
  especializacoes?: string[];
  commission_percentage?: number;
  comissao_percentual?: number;
  hire_date?: string;
  data_contratacao?: string;
  status?: string;
  created_at?: string;
  criado_em?: string;
  updated_at?: string;
  atualizado_em?: string;
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

// Add the missing type exports that the test file expects
export interface ProfessionalCreate extends ProfessionalFormData {
  business_id: string;
}

export interface ProfessionalUpdate extends Partial<ProfessionalFormData> {}

export interface ProfessionalSearchParams {
  business_id: string;
  search?: string;
  status?: string;
  specialties?: string[];
  position?: string;
}
