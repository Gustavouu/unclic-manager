
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
};

export type ProfessionalCreateForm = Omit<Professional, 'id'>;

export type Option = {
  label: string;
  value: string;
};
