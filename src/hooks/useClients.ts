
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { Client } from '@/types/client';
import { normalizeClientData, tableExists } from '@/utils/databaseUtils';

export { type Client } from '@/types/client';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchClients = async () => {
      if (!businessId) return;
      
      setLoading(true);
      try {
        let clientsData: any[] = [];
        
        // Try clients table first
        const clientsExists = await tableExists('clients');
        
        if (clientsExists) {
          const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('business_id', businessId);
            
          if (error) {
            console.error('Error fetching clients:', error);
          } else if (data && data.length > 0) {
            clientsData = data.map(normalizeClientData);
          }
        }
        
        // If no data found, try legacy clientes table
        if (clientsData.length === 0) {
          try {
            const clientesExists = await tableExists('clientes');
            
            if (clientesExists) {
              const { data, error } = await supabase
                .from('clientes' as any)
                .select('*')
                .eq('id_negocio', businessId);
                
              if (error) {
                console.error('Error fetching from clientes table:', error);
              } else if (data && data.length > 0) {
                clientsData = data.map(normalizeClientData);
              }
            }
          } catch (error) {
            console.error('Error checking clientes table:', error);
          }
        }
        
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setError('Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [businessId]);

  return { clients, loading, error };
};
