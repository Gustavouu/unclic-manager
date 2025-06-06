
export interface Service {
  id: string;
  business_id?: string;
  id_negocio?: string;
  name: string;
  nome?: string;
  description?: string;
  descricao?: string;
  duration: number;
  duracao?: number;
  price: number;
  preco?: number;
  category?: string;
  categoria?: string;
  is_active?: boolean;
  ativo?: boolean;
  image_url?: string;
  commission_percentage?: number;
  created_at?: string;
  criado_em?: string;
  updated_at?: string;
  atualizado_em?: string;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
  image_url?: string;
  commission_percentage?: number;
  is_active?: boolean;
}

export interface ServiceSearchParams {
  business_id: string;
  search?: string;
  category?: string;
  is_active?: boolean;
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

// Add the missing type exports
export interface ServiceCreate extends ServiceFormData {
  business_id: string;
}

export interface ServiceUpdate extends Partial<ServiceFormData> {}
