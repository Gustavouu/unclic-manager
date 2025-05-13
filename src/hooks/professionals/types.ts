
export type ProfessionalStatus = "active" | "vacation" | "leave" | "inactive";

export type Professional = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  bio?: string;
  specialties: string[];
  commissionPercentage?: number;
  photoUrl?: string;
  status: ProfessionalStatus;
  hireDate?: string;
  userId?: string;
};

export type ProfessionalCreateForm = Omit<Professional, 'id'>;

export type Option = {
  label: string;
  value: string;
};
