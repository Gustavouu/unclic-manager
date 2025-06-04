
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock admin check - in real app this would check user roles
  const isAdmin = user?.email === 'admin@example.com' || user?.user_metadata?.role === 'admin';

  useEffect(() => {
    // Simulate loading permissions
    const loadPermissions = async () => {
      setLoading(true);
      
      // Mock permissions based on user
      setTimeout(() => {
        if (isAdmin) {
          setPermissions(['read', 'write', 'delete', 'admin']);
        } else if (user) {
          setPermissions(['read', 'write']);
        } else {
          setPermissions([]);
        }
        setLoading(false);
      }, 500);
    };

    loadPermissions();
  }, [user, isAdmin]);

  return {
    permissions,
    isAdmin,
    loading,
  };
};
