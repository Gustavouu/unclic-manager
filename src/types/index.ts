
// Re-export all common types for easier imports
export * from './dashboard';
export * from '@/hooks/appointments/types';
export * from '@/hooks/professionals/types';
export * from '@/types/common';

// Common shared types across the application
export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Standardized loading state type
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Standardized response type for data fetching hooks
export interface QueryResponse<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}
