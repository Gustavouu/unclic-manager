
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

export interface AuditLogEntry {
  id: string;
  business_id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  user_agent: string | null;
  success: boolean;
  error_message: string | null;
  created_at: string;
}

export const useAuditLog = (limit: number = 50) => {
  const { businessId } = useTenant();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      if (!businessId) {
        setLogs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('security_audit_logs')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (fetchError) {
          throw fetchError;
        }

        // Type-safe mapping to ensure proper types
        const typedLogs: AuditLogEntry[] = (data || []).map(log => ({
          id: log.id,
          business_id: log.business_id,
          user_id: log.user_id,
          action: log.action,
          table_name: log.table_name || '',
          record_id: log.record_id || '',
          old_values: log.old_values,
          new_values: log.new_values,
          ip_address: log.ip_address ? String(log.ip_address) : null,
          user_agent: log.user_agent || null,
          success: log.success,
          error_message: log.error_message || null,
          created_at: log.created_at,
        }));

        setLogs(typedLogs);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [businessId, limit]);

  const logAction = async (
    action: string,
    tableName?: string,
    recordId?: string,
    oldValues?: any,
    newValues?: any
  ) => {
    try {
      const { error } = await supabase.rpc('log_security_audit', {
        action_param: action,
        table_name_param: tableName,
        record_id_param: recordId,
        old_values_param: oldValues,
        new_values_param: newValues,
        business_id_param: businessId
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error logging audit action:', err);
    }
  };

  return {
    logs,
    loading,
    error,
    logAction,
  };
};
