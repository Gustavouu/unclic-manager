
export * from './appointment';
export * from './client';
export * from './common';
export * from './dashboard';

// Re-export AppointmentStatus with explicit name to avoid ambiguity
export type { AppointmentStatus as AppointmentStatusType } from '@/hooks/appointments/types';
