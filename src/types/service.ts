
export interface Service {
  id: string;
  id_negocio: string;
  nome: string;
  descricao?: string;
  duracao: number;
  preco: number;
  categoria: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  // English aliases for compatibility
  business_id?: string;
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  category?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
}

export interface ServiceCreate extends ServiceFormData {
  business_id: string;
}

export interface ServiceUpdate extends Partial<ServiceFormData> {}

export interface ServiceSearchParams {
  business_id: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  min_duration?: number;
  max_duration?: number;
  is_active?: boolean;
  search?: string;
}

export interface ServiceStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  totalRevenue: number;
  averageRating: number;
  mostPopularDay: string | null;
  mostPopularTime: string | null;
}

export interface ServiceCategory {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategoryCreate {
  business_id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  order?: number;
  is_active?: boolean;
}

export interface ServiceCategoryUpdate extends Partial<Omit<ServiceCategoryCreate, 'business_id'>> {}

export interface ServiceCategoryStats {
  totalServices: number;
  totalAppointments: number;
  totalRevenue: number;
  averagePrice: number;
  mostPopularService: string;
  mostPopularProfessional: string;
}
