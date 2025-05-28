export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string;
  duration: number; // em minutos
  price: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceCreate {
  business_id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  image_url?: string | null;
  is_active?: boolean;
}

export interface ServiceUpdate {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  category?: string;
  image_url?: string | null;
  is_active?: boolean;
}

export interface ServiceStats {
  totalAppointments: number;
  totalRevenue: number;
  averagePrice: number;
  mostPopularProfessional: string | null;
  busiestDay: string | null;
  busiestTime: string | null;
}

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

export interface ServiceCategory {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategoryCreate {
  business_id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
}

export interface ServiceCategoryUpdate {
  name?: string;
  description?: string | null;
  image_url?: string | null;
}

export interface ServiceCategoryStats {
  totalServices: number;
  totalAppointments: number;
  totalRevenue: number;
  averagePrice: number;
  mostPopularService: string | null;
  mostPopularProfessional: string | null;
} 