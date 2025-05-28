export interface Professional {
  id: string;
  business_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  bio: string | null;
  specialties: string[];
  working_hours: WorkingHours;
  status: 'active' | 'inactive' | 'on_leave';
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface WorkingHours {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // formato HH:mm
  end: string; // formato HH:mm
}

export interface ProfessionalCreate {
  business_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string | null;
  bio?: string | null;
  specialties: string[];
  working_hours: WorkingHours;
  status?: 'active' | 'inactive' | 'on_leave';
}

export interface ProfessionalUpdate {
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string | null;
  bio?: string | null;
  specialties?: string[];
  working_hours?: WorkingHours;
  status?: 'active' | 'inactive' | 'on_leave';
}

export interface ProfessionalStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  averageRating: number;
  totalRevenue: number;
  mostPopularService: string | null;
  busiestDay: string | null;
  busiestTime: string | null;
}

export interface ProfessionalSearchParams {
  business_id: string;
  status?: 'active' | 'inactive' | 'on_leave';
  specialty?: string;
  rating?: number;
  search?: string;
}

export interface ProfessionalAvailability {
  date: string;
  available_slots: TimeSlot[];
  unavailable_slots: TimeSlot[];
} 