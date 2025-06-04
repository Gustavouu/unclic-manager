
// Re-export all client-related hooks
export { useClientsData } from './useClientsData';
export { useClientsAdvanced } from './useClientsAdvanced';
export { useClientAnalytics } from './useClientAnalytics';
export { useClientsList } from './useClientsList';
export { useClientOperations } from './useClientOperations';
export { useClientSearch } from './useClientSearch';

// Re-export types from the main types file
export type { Client, ClientFormData } from '@/types/client';
