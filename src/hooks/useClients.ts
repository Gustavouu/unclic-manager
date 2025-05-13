
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import { Client, ClientFormData } from '@/types/client';

export const useClients = (onClientCreated?: (client: any) => void) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const fetchClients = useCallback(async () => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // First, try to fetch from the new clients table
      let { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', businessId);

      if (error) throw error;

      // If we got data from the new table, use it
      if (data && data.length > 0) {
        const formattedClients = data.map(client => ({
          ...client,
          status: client.last_visit ? 'active' as const : 'inactive' as const
        }));
        setClients(formattedClients);
      } else {
        // If no data from new table, try the legacy table
        const { data: legacyData, error: legacyError } = await supabase
          .from('clientes')
          .select('*')
          .eq('id_negocio', businessId);

        if (legacyError) throw legacyError;

        const formattedClients = (legacyData || []).map(client => ({
          id: client.id,
          name: client.nome,
          nome: client.nome,
          email: client.email,
          phone: client.telefone,
          telefone: client.telefone,
          city: client.cidade,
          cidade: client.cidade,
          state: client.estado,
          estado: client.estado,
          address: client.endereco,
          endereco: client.endereco,
          birth_date: client.data_nascimento,
          data_nascimento: client.data_nascimento,
          gender: client.genero,
          genero: client.genero,
          notes: client.notas,
          notas: client.notas,
          last_visit: client.ultima_visita,
          ultima_visita: client.ultima_visita,
          total_spent: client.valor_total_gasto,
          valor_total_gasto: client.valor_total_gasto,
          business_id: client.id_negocio,
          id_negocio: client.id_negocio,
          created_at: client.criado_em,
          criado_em: client.criado_em,
          updated_at: client.atualizado_em,
          status: client.ultima_visita ? 'active' as const : 'inactive' as const
        }));
        
        setClients(formattedClients);
      }
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  const createClient = async (formData: ClientFormData) => {
    if (!businessId) {
      setError('Business ID is required');
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Map the form data to the appropriate schema
      const clientData = {
        business_id: businessId,
        name: formData.name || formData.nome,
        email: formData.email,
        phone: formData.phone || formData.telefone,
        city: formData.city || formData.cidade,
        state: formData.state || formData.estado,
        address: formData.address,
        gender: formData.gender,
        notes: formData.notes
      };

      // Insert into the new clients table
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;

      const newClient = {
        ...data,
        status: 'active' as const
      };

      setClients(prev => [...prev, newClient]);
      toast.success('Cliente criado com sucesso!');
      
      if (onClientCreated) {
        onClientCreated(newClient);
      }

      return newClient;
    } catch (err: any) {
      console.error('Error creating client:', err);
      setError(err.message);
      toast.error('Erro ao criar cliente');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a function to find a client by email
  const findClientByEmail = async (email: string) => {
    if (!businessId || !email) return null;
    
    try {
      // Try new table first
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', businessId)
        .eq('email', email)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          // Try legacy table
          const { data: legacyData, error: legacyError } = await supabase
            .from('clientes')
            .select('*')
            .eq('id_negocio', businessId)
            .eq('email', email)
            .single();
            
          if (legacyError) {
            if (legacyError.code !== 'PGRST116') {
              console.error('Error finding client:', legacyError);
            }
            return null;
          }
          
          return {
            ...legacyData,
            name: legacyData.nome,
            phone: legacyData.telefone,
            status: legacyData.ultima_visita ? 'active' as const : 'inactive' as const
          };
        }
        
        console.error('Error finding client:', error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Error finding client:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    isSubmitting,
    error,
    fetchClients,
    createClient,
    findClientByEmail
  };
};
