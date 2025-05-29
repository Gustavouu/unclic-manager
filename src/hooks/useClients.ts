
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
      // Use the correct field names for the clients table (legacy format)
      const newClient = {
        id: crypto.randomUUID(),
        nome: clientData.name, // Use 'nome' instead of 'name'
        email: clientData.email,
        telefone: clientData.phone, // Use 'telefone' instead of 'phone'
        data_nascimento: clientData.birth_date, // Use 'data_nascimento' instead of 'birth_date'
        genero: clientData.gender, // Use 'genero' instead of 'gender'
        endereco: clientData.address, // Use 'endereco' instead of 'address'
        cidade: clientData.city, // Use 'cidade' instead of 'city'
        estado: clientData.state, // Use 'estado' instead of 'state'
        cep: clientData.zip_code, // Use 'cep' instead of 'zip_code'
        notas: clientData.notes, // Use 'notas' instead of 'notes'
        criado_em: new Date().toISOString(), // Use 'criado_em' instead of 'created_at'
        atualizado_em: new Date().toISOString(), // Use 'atualizado_em' instead of 'updated_at'
        id_negocio: '00000000-0000-0000-0000-000000000000', // Required field
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(newClient)
        .select()
        .single();

      if (error) throw error;

      // Convert back to Client format for state
      const clientForState: Client = {
        id: data.id,
        name: data.nome,
        email: data.email,
        phone: data.telefone,
        birth_date: data.data_nascimento,
        gender: data.genero,
        address: data.endereco,
        city: data.cidade,
        state: data.estado,
        zip_code: data.cep,
        notes: data.notas,
        created_at: data.criado_em,
        updated_at: data.atualizado_em,
        business_id: data.id_negocio,
      };

      setClients(prev => [clientForState, ...prev]);
      toast.success('Cliente criado com sucesso!');
      return clientForState;
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
