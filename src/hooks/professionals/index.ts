
// Re-export all professional-related hooks
export { useProfessionalsList } from './useProfessionalsList';
export { useProfessionalsOperations } from './useProfessionalsOperations';
export { useProfessionals } from './useProfessionals';

// Re-export types from both files
export type { Professional, ProfessionalFormData } from '@/types/professional';
export type { Professional as ProfessionalLocal, ProfessionalFormData as ProfessionalFormDataLocal, ProfessionalStatus } from './types';
