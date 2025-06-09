
export * from './appointment';
export * from './client';
export * from './common';
export * from './dashboard';
export * from './waitlist';
export * from './recurrence';

// Re-export AppointmentStatus with explicit name to avoid ambiguity
export type { AppointmentStatus as AppointmentStatusType } from '@/hooks/appointments/types';
