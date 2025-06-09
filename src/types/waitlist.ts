export interface WaitlistEntry {
  id: string;
  business_id: string;
  client_id: string;
  service_id?: string;
  preferred_date?: string;
  notes?: string;
  created_at: string;
}

export interface WaitlistCreate {
  business_id: string;
  client_id: string;
  service_id?: string;
  preferred_date?: string;
  notes?: string;
}
