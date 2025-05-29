
// Export the main client operations
export { useClientsList } from './useClientsList';
export { useClientOperations } from './useClientOperations';
export { useClientSearch } from './useClientSearch';

// Export the Client type with a specific name to avoid conflicts
export type { Client as ClientType } from './useClientsList';
