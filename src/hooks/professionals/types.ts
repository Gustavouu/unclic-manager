
export type Professional = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  photo_url?: string;
  bio?: string;
  position?: string;
  hire_date?: Date;
  commission_percentage?: number;
  isActive?: boolean;
};

export type ProfessionalFormValues = {
  name: string;
  email: string;
  phone: string;
  position?: string;
  specialties: string[];
  photo_url?: string;
  bio?: string;
  commission_percentage?: number;
};
