
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { Client, ClientFormData } from '@/types/client';
import { normalizeClientData, tableExists } from '@/utils/databaseUtils';

export { type Client, type ClientFormData } from '@/types/client';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
            const clientesExists = await tableExists('funcionarios'); // Use funcionarios as proxy check
            
            if (clientesExists) {
              // Try to use the clients table instead of clientes
              const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('id_negocio', businessId);
                
              if (error) {
                console.error('Error fetching from clients table:', error);
              } else if (data && data.length > 0) {
                clientsData = data.map(normalizeClientData);
              }
            }
          } catch (error) {
            console.error('Error checking clients table:', error);
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

  const createClient = async (clientData: ClientFormData) => {
    if (!businessId) {
      throw new Error('Business ID is required');
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          ...clientData,
          business_id: businessId
        }])
        .select()
        .single();

      if (error) throw error;

      const normalizedClient = normalizeClientData(data);
      setClients(prev => [...prev, normalizedClient]);
      
      return normalizedClient;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { clients, loading, error, createClient, isSubmitting };
};
