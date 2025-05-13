
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/database.types';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ztwntsmwzstvmoqgiztc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d250c213enN0dm1vcWdpenRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzkxNDMsImV4cCI6MjA2Mjc1NTE0M30.WYYk5DVBrHj6Po6w0VSdiz4ezScu6iPfmultRIpoz_I';

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Function to set tenant context
export async function setTenantContext(tenantId: string) {
  try {
    await supabase.rpc('set_tenant_context', { tenant_id: tenantId });
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Erro ao definir contexto do tenant:', error);
    return { success: false, error: error.message };
  }
}

// Function to clear tenant context
export async function clearTenantContext() {
  try {
    await supabase.rpc('clear_tenant_context');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Erro ao limpar contexto do tenant:', error);
    return { success: false, error: error.message };
  }
}

// Function to get current tenant
export async function getCurrentTenant() {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Erro ao obter tenant atual:', error);
    return { data: null, error: error.message };
  }
}

// Function to get all tenants for the current user
export async function getUserTenants() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const { data, error } = await supabase
      .from('business_users')
      .select(`
        business_id,
        role,
        businesses:business_id (
          id,
          name,
          logo_url,
          slug
        )
      `)
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    // Transform data to a more friendly format
    const tenants = data?.map(item => ({
      id: item.business_id,
      name: (item.businesses as any)?.name,
      logo_url: (item.businesses as any)?.logo_url,
      slug: (item.businesses as any)?.slug,
      role: item.role
    }));
    
    return { data: tenants, error: null };
  } catch (error: any) {
    console.error('Erro ao obter tenants do usuário:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Function to fetch data with cache
 * @param cacheKey Unique key for the cache
 * @param fetchFunction Function that performs the data fetching
 * @param ttlMinutes Cache time-to-live in minutes
 */
export async function fetchWithCache<T>(
  cacheKey: string, 
  fetchFunction: () => Promise<T>, 
  ttlMinutes: number = 5
): Promise<T> {
  // Check if there's cached data
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    try {
      const { data, timestamp } = JSON.parse(cachedData);
      const cacheAge = (Date.now() - timestamp) / (1000 * 60); // in minutes
      
      // If cache is still valid, return the data
      if (cacheAge < ttlMinutes) {
        return data as T;
      }
    } catch (error) {
      console.error('Erro ao processar cache:', error);
      // Continue and fetch new data if there's an error in the cache
    }
  }
  
  // Fetch new data
  const data = await fetchFunction();
  
  // Store in cache
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Erro ao armazenar em cache:', error);
    // Continue even if caching fails
  }
  
  return data;
}
