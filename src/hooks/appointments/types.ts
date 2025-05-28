
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show' | 'agendado' | 'confirmado' | 'concluido' | 'cancelado' | 'faltou';

export interface CreateAppointmentData {
  clientId: string;
  serviceId: string;
  professionalId: string;
  date: Date;
  time: string;
  endTime?: string;
  duration?: number;
  price?: number;
  status?: AppointmentStatus;
  paymentMethod?: string;
  notes?: string;
}

export interface UpdatedAppointmentData extends Partial<CreateAppointmentData> {
  status?: AppointmentStatus;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  serviceType: string;
  professionalId: string;
  professionalName: string;
  date: Date;
  duration: number;
  price: number;
  status: AppointmentStatus;
  notes: string;
  paymentMethod?: string;
}
