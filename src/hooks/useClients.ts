
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  last_visit?: string;
  total_spent?: number;
  business_id?: string;
  user_id?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClientFormData {
  name: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  notes?: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar clientes');
    } finally {
      setLoading(false);
    }
  };

  const findClientByEmail = async (email: string): Promise<Client | null> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error finding client by email:', err);
      return null;
    }
  };

  const createClient = async (clientData: ClientFormData) => {
    setIsSubmitting(true);
    try {
      const newClient = {
        id: crypto.randomUUID(),
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        birth_date: clientData.birth_date,
        gender: clientData.gender,
        address: clientData.address,
        city: clientData.city,
        state: clientData.state,
        zip_code: clientData.zip_code,
        notes: clientData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(newClient)
        .select()
        .single();

      if (error) throw error;

      setClients(prev => [data, ...prev]);
      toast.success('Cliente criado com sucesso!');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    createClient,
    findClientByEmail,
    isSubmitting,
    refetch: fetchClients,
  };
};
