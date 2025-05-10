
import { createClient } from '@supabase/supabase-js';

// Obter variáveis de ambiente - usando import.meta.env ao invés de process.env para o Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Função para buscar dados com cache
 * @param cacheKey Chave única para o cache
 * @param fetchFunction Função que realiza a busca dos dados
 * @param ttlMinutes Tempo de vida do cache em minutos
 */
export async function fetchWithCache<T>(
  cacheKey: string, 
  fetchFunction: () => Promise<T>, 
  ttlMinutes: number = 5
): Promise<T> {
  // Verificar se há dados em cache
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    try {
      const { data, timestamp } = JSON.parse(cachedData);
      const cacheAge = (Date.now() - timestamp) / (1000 * 60); // em minutos
      
      // Se o cache ainda é válido, retornar os dados
      if (cacheAge < ttlMinutes) {
        return data as T;
      }
    } catch (error) {
      console.error('Erro ao processar cache:', error);
      // Continuar e buscar dados novos se houver erro no cache
    }
  }
  
  // Buscar dados novos
  const data = await fetchFunction();
  
  // Armazenar em cache
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Erro ao armazenar em cache:', error);
    // Continuar mesmo se o cache falhar
  }
  
  return data;
}

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

// Interface para representar um tenant
interface Tenant {
  id: string;
  name: string;
  logo_url: string;
  slug: string;
  role: string;
}

// Interface para representar os dados retornados pela consulta
interface TenantQueryResult {
  tenant_id: string;
  role: string;
  tenants?: Record<string, any> | null;
}

// Função para obter todos os tenants do usuário atual
export async function getUserTenants(): Promise<{ data: Tenant[] | null, error: string | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    // Verifique se estamos usando as tabelas em português ou inglês
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
    
    console.log('Dados obtidos dos tenants:', data);
    
    // Verificar se os dados estão em um formato esperado
    if (!Array.isArray(data)) {
      console.error('Dados recebidos não são um array:', data);
      return { data: null, error: 'Formato de dados inesperado' };
    }
    
    // Transformar os dados corretamente acessando as propriedades aninhadas
    const tenants = data.map((item: TenantQueryResult) => {
      // Verificar se temos o objeto tenants ou se precisa acessar de outra forma
      const tenantData = item.tenants || {};
      
      // Se tenantData é um array, pegue o primeiro elemento
      const tenant = Array.isArray(tenantData) 
        ? (tenantData[0] || {}) 
        : tenantData;
      
      // Extrair as propriedades com segurança usando valores padrão
      return {
        id: item.tenant_id,
        name: String(tenant.name || ''),
        logo_url: String(tenant.logo_url || ''),
        slug: String(tenant.slug || ''),
        role: item.role || ''
      };
    });
    
    return { data: tenants, error: null };
  } catch (error: any) {
    console.error('Erro ao obter tenants do usuário:', error);
    return { data: null, error: error.message };
  }
}
