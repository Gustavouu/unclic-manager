
export type ProfessionalStatus = "active" | "vacation" | "leave" | "inactive";

export interface Professional {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  specialties: string[];
  photoUrl?: string;
  bio?: string;
  status: ProfessionalStatus;
  hireDate?: string;
  commissionPercentage: number;
  userId?: string;
}

export interface ProfessionalCreateForm {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  specialties: string[];
  bio?: string;
  commissionPercentage?: number;
}
