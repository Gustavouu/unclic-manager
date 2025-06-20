import { createClient } from '@supabase/supabase-js';

// Obter variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para definir o contexto do tenant
export async function setTenantContext(tenantId: string) {
  try {
    await supabase.rpc('set_tenant_context', { tenant_id: tenantId });
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Erro ao definir contexto do tenant:', error);
    return { success: false, error: error.message };
  }
}

// Função para limpar o contexto do tenant
export async function clearTenantContext() {
  try {
    await supabase.rpc('clear_tenant_context');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Erro ao limpar contexto do tenant:', error);
    return { success: false, error: error.message };
  }
}

// Função para obter o tenant atual
export async function getCurrentTenant() {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Erro ao obter tenant atual:', error);
    return { data: null, error: error.message };
  }
}

// Função para obter todos os tenants do usuário atual
export async function getUserTenants() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const { data, error } = await supabase
      .from('tenant_users')
      .select(`
        tenant_id,
        role,
        tenants:tenant_id (
          id,
          name,
          logo_url,
          slug
        )
      `)
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    // Transformar dados para formato mais amigável
    const tenants = data.map(item => ({
      id: item.tenant_id,
      name: item.tenants.name,
      logo_url: item.tenants.logo_url,
      slug: item.tenants.slug,
      role: item.role
    }));
    
    return { data: tenants, error: null };
  } catch (error: any) {
    console.error('Erro ao obter tenants do usuário:', error);
    return { data: null, error: error.message };
  }
}
