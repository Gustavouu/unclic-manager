
export interface Professional {
  id: string;
  name: string;
  specialties?: string[];
  role?: string;
  email?: string;
  phone?: string;
}

export interface ProfessionalsHookReturn {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  fetchProfessionals: () => Promise<void>;
}
