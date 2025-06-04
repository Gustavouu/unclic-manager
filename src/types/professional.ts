export interface Professional {
  id: string;
  business_id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  specialties: string[];
  working_hours: {
    [key: string]: TimeSlot[];
  };
  status: 'active' | 'inactive' | 'on_leave';
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface ProfessionalCreate {
  business_id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  specialties: string[];
  working_hours: {
    [key: string]: TimeSlot[];
  };
  status?: 'active' | 'inactive' | 'on_leave';
}

export interface ProfessionalUpdate {
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  specialties?: string[];
  working_hours?: {
    [key: string]: TimeSlot[];
  };
  status?: 'active' | 'inactive' | 'on_leave';
  rating?: number;
  total_reviews?: number;
}

export interface ProfessionalSearchParams {
  business_id: string;
  status?: 'active' | 'inactive' | 'on_leave';
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
  available_slots: TimeSlot[];
  unavailable_slots: TimeSlot[];
}
