
// Unified appointment types to resolve conflicts between different type definitions
export type AppointmentStatus = 
  | 'agendado' 
  | 'confirmado' 
  | 'concluido' 
  | 'cancelado' 
  | 'faltou'
  | 'scheduled' 
  | 'confirmed' 
  | 'completed' 
  | 'canceled' 
  | 'no_show';

export interface UnifiedAppointment {
  id: string;
  business_id: string;
  client_id: string;
  client_name?: string;
  professional_id: string;
  professional_name?: string;
  service_id: string;
  service_name?: string;
  service_type?: string;
  date: Date;
  start_time: string;
  end_time: string;
  duration: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  payment_method?: string;
  payment_status?: 'pending' | 'paid' | 'refunded' | 'partially_paid';
  rating?: number;
  feedback_comment?: string;
  reminder_sent?: boolean;
  created_at: string;
  updated_at: string;
  // Legacy compatibility fields
  clientId?: string;
  clientName?: string;
  serviceId?: string;
  serviceName?: string;
  professionalId?: string;
  professionalName?: string;
}

// Status mapping utilities
export const statusMapping = {
  // Portuguese to English
  'agendado': 'scheduled',
  'confirmado': 'confirmed', 
  'concluido': 'completed',
  'cancelado': 'canceled',
  'faltou': 'no_show',
  // English to Portuguese
  'scheduled': 'agendado',
  'confirmed': 'confirmado',
  'completed': 'concluido', 
  'canceled': 'cancelado',
  'no_show': 'faltou'
} as const;

export function normalizeStatus(status: string): AppointmentStatus {
  const mapped = statusMapping[status as keyof typeof statusMapping];
  return (mapped || status) as AppointmentStatus;
}

export function isCompletedStatus(status: AppointmentStatus): boolean {
  return status === 'concluido' || status === 'completed';
}

export function isScheduledStatus(status: AppointmentStatus): boolean {
  return status === 'agendado' || status === 'scheduled';
}

export function isCanceledStatus(status: AppointmentStatus): boolean {
  return status === 'cancelado' || status === 'canceled';
}
