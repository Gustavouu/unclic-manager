
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Re-export the auth hook for backward compatibility
export const useAuth = useAuthContext;
