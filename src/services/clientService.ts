
import { supabase } from '@/integrations/supabase/client';
import { validateEmail, validatePhone, validateZipCode, formatValidationError } from '@/utils/databaseUtils';
import type { Client } from '@/types/client';

// Helper function to safely parse JSON preferences
const safeParsePreferences = (preferences: any): Record<string, any> => {
  if (!preferences) return {};
  if (typeof preferences === 'object' && preferences !== null) return preferences;
  if (typeof preferences === 'string') {
    try {
      return JSON.parse(preferences);
    } catch {
      return {};
    }
  }
  return {};
};

export const fetchClients = async (businessId: string): Promise<Client[]> => {
  try {
    console.log('Fetching clients for business:', businessId);
    
    // Use clients table (consolidated)
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }

    console.log('Successfully fetched clients:', clients?.length || 0);
    
    // Convert to Client type with proper preference parsing
    return (clients || []).map(client => ({
      ...client,
      preferences: safeParsePreferences(client.preferences)
    }));
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const createClient = async (clientData: Partial<Client>): Promise<Client> => {
  try {
    console.log('Creating client with data:', clientData);

    // Normalize input data before validation
    const normalizedData = {
      ...clientData,
      name: clientData.name?.trim() || '',
      email: clientData.email?.toLowerCase().trim() || '',
      city: clientData.city?.trim() || '',
      state: clientData.state?.toUpperCase().trim() || '',
      phone: clientData.phone?.replace(/[^0-9+\-\(\)\s]/g, '') || '',
      zip_code: clientData.zip_code?.replace(/[^0-9]/g, '') || ''
    };

    // Client-side validation for better UX
    if (!normalizedData.name || normalizedData.name.trim() === '') {
      throw new Error('Nome do cliente é obrigatório');
    }

    if (normalizedData.email && !validateEmail(normalizedData.email)) {
      throw new Error('Email inválido');
    }

    if (normalizedData.phone && !validatePhone(normalizedData.phone)) {
      throw new Error('Telefone inválido');
    }

    if (normalizedData.zip_code && !validateZipCode(normalizedData.zip_code)) {
      throw new Error('CEP inválido');
    }

    // Insert with server-side validation via triggers
    const { data: client, error } = await supabase
      .from('clients')
      .insert([{
        business_id: normalizedData.business_id,
        name: normalizedData.name,
        email: normalizedData.email || null,
        phone: normalizedData.phone || null,
        birth_date: normalizedData.birth_date || null,
        gender: normalizedData.gender || null,
        address: normalizedData.address || null,
        city: normalizedData.city || null,
        state: normalizedData.state || null,
        zip_code: normalizedData.zip_code || null,
        notes: normalizedData.notes || null,
        status: normalizedData.status || 'active',
        preferences: normalizedData.preferences || {}
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      throw new Error(formatValidationError(error));
    }

    console.log('Successfully created client');
    return {
      ...client,
      preferences: safeParsePreferences(client.preferences)
    };
  } catch (error: any) {
    console.error('Error creating client:', error);
    throw new Error(formatValidationError(error));
  }
};

export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
  try {
    console.log('Updating client:', id, 'with data:', clientData);

    // Normalize input data
    const normalizedData = {
      ...clientData,
      name: clientData.name?.trim() || '',
      email: clientData.email?.toLowerCase().trim() || '',
      city: clientData.city?.trim() || '',
      state: clientData.state?.toUpperCase().trim() || '',
      phone: clientData.phone?.replace(/[^0-9+\-\(\)\s]/g, '') || '',
      zip_code: clientData.zip_code?.replace(/[^0-9]/g, '') || ''
    };

    // Client-side validation
    if (normalizedData.name !== undefined && (!normalizedData.name || normalizedData.name.trim() === '')) {
      throw new Error('Nome do cliente é obrigatório');
    }

    if (normalizedData.email && !validateEmail(normalizedData.email)) {
      throw new Error('Email inválido');
    }

    if (normalizedData.phone && !validatePhone(normalizedData.phone)) {
      throw new Error('Telefone inválido');
    }

    if (normalizedData.zip_code && !validateZipCode(normalizedData.zip_code)) {
      throw new Error('CEP inválido');
    }

    // Update with server-side validation
    const updateData: any = {};
    
    // Only include fields that are being updated
    if (normalizedData.name !== undefined) updateData.name = normalizedData.name;
    if (normalizedData.email !== undefined) updateData.email = normalizedData.email || null;
    if (normalizedData.phone !== undefined) updateData.phone = normalizedData.phone || null;
    if (normalizedData.birth_date !== undefined) updateData.birth_date = normalizedData.birth_date || null;
    if (normalizedData.gender !== undefined) updateData.gender = normalizedData.gender || null;
    if (normalizedData.address !== undefined) updateData.address = normalizedData.address || null;
    if (normalizedData.city !== undefined) updateData.city = normalizedData.city || null;
    if (normalizedData.state !== undefined) updateData.state = normalizedData.state || null;
    if (normalizedData.zip_code !== undefined) updateData.zip_code = normalizedData.zip_code || null;
    if (normalizedData.notes !== undefined) updateData.notes = normalizedData.notes || null;
    if (normalizedData.status !== undefined) updateData.status = normalizedData.status;
    if (normalizedData.preferences !== undefined) updateData.preferences = normalizedData.preferences || {};

    const { data: client, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      throw new Error(formatValidationError(error));
    }

    console.log('Successfully updated client');
    return {
      ...client,
      preferences: safeParsePreferences(client.preferences)
    };
  } catch (error: any) {
    console.error('Error updating client:', error);
    throw new Error(formatValidationError(error));
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    console.log('Deleting client:', id);

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }

    console.log('Successfully deleted client');
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

export const searchClients = async (params: { search?: string; business_id?: string; limit?: number; offset?: number }): Promise<Client[]> => {
  try {
    if (!params.business_id) {
      return [];
    }

    console.log('Searching clients with params:', params);

    let query = supabase
      .from('clients')
      .select('*')
      .eq('business_id', params.business_id);

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    query = query.order('created_at', { ascending: false });

    const { data: clients, error } = await query;

    if (error) {
      console.error('Error searching clients:', error);
      throw error;
    }

    console.log('Successfully searched clients:', clients?.length || 0, 'results');
    return (clients || []).map(client => ({
      ...client,
      preferences: safeParsePreferences(client.preferences)
    }));
  } catch (error) {
    console.error('Error searching clients:', error);
    return [];
  }
};

export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    console.log('Getting client by ID:', id);

    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('Client not found');
        return null;
      }
      console.error('Error getting client by ID:', error);
      return null;
    }

    console.log('Successfully found client');
    return {
      ...client,
      preferences: safeParsePreferences(client.preferences)
    };
  } catch (error) {
    console.error('Error getting client by ID:', error);
    return null;
  }
};

export const findClientByEmail = async (email: string, businessId: string): Promise<Client | null> => {
  try {
    console.log('Finding client by email:', email, 'for business:', businessId);

    if (!validateEmail(email)) {
      return null;
    }

    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('business_id', businessId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('Client not found by email');
        return null;
      }
      console.error('Error finding client by email:', error);
      return null;
    }

    console.log('Successfully found client by email');
    return {
      ...client,
      preferences: safeParsePreferences(client.preferences)
    };
  } catch (error) {
    console.error('Error finding client by email:', error);
    return null;
  }
};

export const findClientByPhone = async (phone: string, businessId: string): Promise<Client | null> => {
  try {
    console.log('Finding client by phone:', phone, 'for business:', businessId);

    if (!validatePhone(phone)) {
      return null;
    }

    const cleanPhone = phone.replace(/[^0-9+\-\(\)\s]/g, '');

    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('phone', cleanPhone)
      .eq('business_id', businessId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('Client not found by phone');
        return null;
      }
      console.error('Error finding client by phone:', error);
      return null;
    }

    console.log('Successfully found client by phone');
    return {
      ...client,
      preferences: safeParsePreferences(client.preferences)
    };
  } catch (error) {
    console.error('Error finding client by phone:', error);
    return null;
  }
};
