
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
};
