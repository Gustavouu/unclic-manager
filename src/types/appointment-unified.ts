// Unified appointment types that work with both legacy and standardized data
export interface UnifiedAppointment {
  id: string;
  business_id: string;
  client_id: string;
  client_name?: string;
  professional_id: string;
  professional_name?: string;
  service_id: string;
  service_name?: string;
  service_type: string; // Made required to match Appointment type
  date: Date | string;
  start_time: string;
  end_time: string;
  duration: number;
  price: number;
  status: string;
  notes?: string;
  payment_method?: string;
  payment_status?: string;
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
  time: string; // Add time field for compatibility
}

export function normalizeStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'agendado': 'scheduled',
    'confirmado': 'confirmed',
    'concluido': 'completed',
    'cancelado': 'canceled',
    'faltou': 'no_show',
    'scheduled': 'scheduled',
    'confirmed': 'confirmed',
    'completed': 'completed',
    'canceled': 'canceled',
    'no_show': 'no_show',
  };
  return statusMap[status] || status;
}

export function denormalizeStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'scheduled': 'agendado',
    'confirmed': 'confirmado',
    'completed': 'concluido',
    'canceled': 'cancelado',
    'no_show': 'faltou',
    'agendado': 'agendado',
    'confirmado': 'confirmado',
    'concluido': 'concluido',
    'cancelado': 'cancelado',
    'faltou': 'faltou',
  };
  return statusMap[status] || status;
}

// Status utility functions
export function isCompletedStatus(status: string): boolean {
  const normalizedStatus = normalizeStatus(status);
  return normalizedStatus === 'completed';
}

export function isScheduledStatus(status: string): boolean {
  const normalizedStatus = normalizeStatus(status);
  return normalizedStatus === 'scheduled' || normalizedStatus === 'confirmed';
}

export function isCanceledStatus(status: string): boolean {
  const normalizedStatus = normalizeStatus(status);
  return normalizedStatus === 'canceled' || normalizedStatus === 'no_show';
}
