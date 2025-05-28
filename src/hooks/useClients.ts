
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { Client, ClientFormData } from '@/types/client';
import { normalizeClientData } from '@/utils/databaseUtils';

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
        console.log('Fetching clients for business:', businessId);
        
        // Use the migrated clients table with proper business_id column
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('business_id', businessId);
          
        if (error) {
          console.error('Error fetching clients:', error);
          setError('Failed to fetch clients');
        } else {
          console.log('Found clients:', data?.length || 0);
          const normalizedClients = (data || []).map(normalizeClientData);
          setClients(normalizedClients);
          setError(null);
        }
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
      console.log('Creating client for business:', businessId);
      
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
      
      console.log('Client created successfully:', normalizedClient.name);
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
