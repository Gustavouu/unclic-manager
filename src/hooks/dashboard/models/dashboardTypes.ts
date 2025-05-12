
import { PopularService } from '@/components/dashboard/PopularServicesWidget';

export interface DashboardStats {
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  newClients: number;
  popularServices: PopularService[];
  upcomingAppointments: any[];
  revenueData: Array<{date: string, value: number}>;
  retentionRate: number;
  newClientsCount: number;
  returningClientsCount: number;
  
  // Added properties to match component usage
  clientsCount: number;
  todayAppointments: number;
  monthlyRevenue: number;
  monthlyServices: number;
  occupancyRate: number;
  nextAppointments: any[];
}

export interface AppointmentData {
  id: string;
  data: string;
  valor: number;
  status: string;
}

export interface ClientData {
  id: string;
}

export interface ServiceData {
  id_servico: string;
  servicos?: {
    id?: string;
    nome?: string;
  } | null;
}

export interface UpcomingAppointmentData {
  id: string;
  data: string;
  hora_inicio: string;
  status: string;
  clientes: { nome?: string } | null;
  servicos: { nome?: string } | null;
  funcionarios: { nome?: string } | null;
  valor?: number;
}

export interface FormattedAppointment {
  id: string;
  clientName: string;
  serviceName: string;
  professionalName: string;
  date: string;
  status: string;
  price?: number;
}
