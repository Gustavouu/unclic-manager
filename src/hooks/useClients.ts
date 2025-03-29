
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export const useClients = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const findClientByEmail = async (email: string): Promise<Client | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome, email, telefone')
        .eq('email', email)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
          console.error('Error finding client:', error);
        }
        return null;
      }
      
      return data ? {
        id: data.id,
        name: data.nome,
        email: data.email,
        phone: data.telefone
      } : null;
    } catch (error) {
      console.error('Error finding client:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createClient = async (clientData: Omit<Client, 'id'>): Promise<Client | null> => {
    setIsLoading(true);
    try {
      // Get first available business ID from the database
      const { data: business } = await supabase
        .from('negocios')
        .select('id')
        .limit(1)
        .single();
        
      const businessId = business?.id;
      
      if (!businessId) {
        console.error('No business ID found');
        return null;
      }
      
      // Create the client
      const { data, error } = await supabase
        .from('clientes')
        .insert({
          nome: clientData.name,
          email: clientData.email,
          telefone: clientData.phone,
          id_negocio: businessId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating client:', error);
        toast.error('Erro ao criar cliente');
        return null;
      }
      
      toast.success('Cliente criado com sucesso!');
      
      return {
        id: data.id,
        name: data.nome,
        email: data.email,
        phone: data.telefone
      };
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Erro ao criar cliente');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    findClientByEmail,
    createClient
  };
};
