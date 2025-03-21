
export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  birthDate: string;
  address: string;
  specialties: string[];
  hireDate: string;
  commissionRate: number;
  active: boolean;
  notes?: string;
  lastActivity: string;
}

export interface ScheduleHistoryItem {
  id: string;
  professionalId: string;
  date: string;
  time: string;
  clientName: string;
  serviceName: string;
  value: number;
  status: 'completed' | 'canceled' | 'pending' | 'rescheduled';
}
