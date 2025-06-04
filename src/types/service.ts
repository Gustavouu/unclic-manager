
export interface Service {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceCreate {
  business_id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category: string;
  image_url?: string;
  is_active?: boolean;
}

export interface ServiceUpdate {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  category?: string;
  image_url?: string;
  is_active?: boolean;
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
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategoryCreate {
  business_id: string;
  name: string;
  description?: string;
  image_url?: string;
}

export interface ServiceCategoryUpdate {
  name?: string;
  description?: string;
  image_url?: string;
}

export interface ServiceCategoryStats {
  totalServices: number;
  totalAppointments: number;
  totalRevenue: number;
  averagePrice: number;
  mostPopularService: string;
  mostPopularProfessional: string;
}
