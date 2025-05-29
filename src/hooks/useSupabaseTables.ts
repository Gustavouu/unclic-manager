
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseTables = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        // Since we can't query information_schema directly via the client,
        // we'll return the known tables from our schema
        const knownTables = [
          'businesses',
          'clients', 
          'funcionarios',
          'negocios',
          'servicos',
          'users',
          'financial_transactions',
          'professionals',
          'application_users',
          'bookings',
          'employees',
          'categories'
        ];
        
        setTables(knownTables);
      } catch (err: any) {
        console.error('Error fetching tables:', err);
        setError(err.message || 'Failed to fetch tables');
        setTables([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  return { tables, loading, error };
};
