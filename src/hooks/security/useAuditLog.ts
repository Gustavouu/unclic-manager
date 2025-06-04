
import { useState, useEffect } from 'react';
import { useOptimizedTenant } from '@/contexts/OptimizedTenantContext';

interface AuditLogEntry {
  id: string;
  created_at: string;
  success: boolean;
  action: string;
  user_id: string;
}

export const useAuditLog = (limit = 50) => {
  const { businessId } = useOptimizedTenant();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!businessId) {
        setLogs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // For now, return sample data since audit log table isn't defined
        const sampleLogs: AuditLogEntry[] = [
          {
            id: '1',
            created_at: new Date().toISOString(),
            success: true,
            action: 'login',
            user_id: 'user-1'
          },
          {
            id: '2',
            created_at: new Date(Date.now() - 60000).toISOString(),
            success: true,
            action: 'create_appointment',
            user_id: 'user-1'
          }
        ];

        setLogs(sampleLogs.slice(0, limit));
      } catch (err) {
        console.error('Error fetching audit logs:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [businessId, limit]);

  return {
    logs,
    loading,
    error,
  };
};
