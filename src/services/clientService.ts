
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Client } from '@/types/client';

/**
 * Fetch all clients for a business
 */
export async function fetchClients(businessId: string): Promise<Client[]> {
  if (!businessId) {
    console.log('No business ID available, skipping client fetch');
    return [];
  }

  try {
    console.log('Fetching clients for business ID:', businessId);
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('business_id', businessId);

    if (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Não foi possível carregar os clientes.");
      throw error;
    }

    return data || [];
  } catch (err: any) {
    console.error("Erro inesperado ao buscar clientes:", err);
    throw err;
  }
}

/**
 * Create a new client
 */
export async function createClient(clientData: Partial<Client>, businessId: string): Promise<Client> {
  try {
    if (!businessId) {
      throw new Error("ID do negócio não disponível");
    }
    
    console.log('Creating client for business ID:', businessId, clientData);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("Usuário não autenticado");
      throw new Error("Usuário não autenticado");
    }
    
    const dataToInsert = {
      ...clientData,
      business_id: businessId
    };

    const { data, error } = await supabase
      .from('clients')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      throw error;
    }

    return data;
    
  } catch (err: any) {
    console.error("Error creating client:", err);
    throw err;
  }
}

/**
 * Find a client by email
 */
export async function findClientByEmail(email: string, businessId: string): Promise<Client | null> {
  try {
    if (!businessId) {
      throw new Error("ID do negócio não disponível");
    }
    
    console.log('Finding client by email for business ID:', businessId, email);
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .eq('business_id', businessId)
      .maybeSingle();

    if (error) throw error;
    
    return data;
    
  } catch (err: any) {
    console.error("Error finding client:", err);
    return null;
  }
}

/**
 * Find a client by phone number
 */
export async function findClientByPhone(phone: string, businessId: string): Promise<Client | null> {
  try {
    if (!businessId) {
      throw new Error("ID do negócio não disponível");
    }
    
    console.log('Finding client by phone for business ID:', businessId, phone);
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('phone', phone)
      .eq('business_id', businessId)
      .maybeSingle();

    if (error) throw error;
    
    return data;
    
  } catch (err: any) {
    console.error("Error finding client by phone:", err);
    return null;
  }
}
