// Re-export everything from the main types file to avoid conflicts
export type { 
  AppointmentStatus, 
  ServiceType, 
  DateFilter, 
  CalendarViewType,
  Appointment,
  AppointmentType,
  CreateAppointmentData,
  UpdatedAppointmentData
} from '@/hooks/appointments/types';

export { SERVICE_TYPE_NAMES } from '@/hooks/appointments/types';

// Keep any component-specific types here if needed
export interface AppointmentFilters {
  searchTerm: string;
  statusFilter: string;
  serviceFilter: string;
  dateFilter: string;
  customDateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}
