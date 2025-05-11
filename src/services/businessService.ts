
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Cache keys
export const CACHE_KEYS = {
  BUSINESS: (userId: string) => `business-${userId}`,
  BUSINESS_STATUS: (userId: string) => `business-status-${userId}`,
  ONBOARDING_STATUS: (userId: string) => `onboarding-status-${userId}`,
};

// Cache duration in milliseconds
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Types
export type Business = {
  id: string;
  nome: string;
  slug: string;
  email_admin: string;
  telefone?: string;
  endereco?: string;
  url_logo?: string;
  status: string;
};

export type OnboardingStatus = {
  needsOnboarding: boolean;
  businessId: string | null;
};

// Function to check if cache is still valid
const isCacheValid = (timestamp: string): boolean => {
  const cachedTime = parseInt(timestamp);
  const now = Date.now();
  return now - cachedTime < CACHE_DURATION;
};

// Get business data with caching
export const getBusinessData = async (userId: string, skipCache = false): Promise<Business | null> => {
  if (!userId) return null;
  
  try {
    // Check cache first
    const cacheKey = CACHE_KEYS.BUSINESS(userId);
    const timestampKey = `${cacheKey}-timestamp`;
    
    if (!skipCache) {
      const cachedBusiness = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(timestampKey);
      
      if (cachedBusiness && cachedTimestamp && isCacheValid(cachedTimestamp)) {
        console.log("Usando dados em cache do negócio");
        return JSON.parse(cachedBusiness);
      }
    }
    
    console.log(`Buscando dados do negócio para o usuário ${userId}`);
    
    // Get the user's associated business
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id_negocio')
      .eq('id', userId)
      .maybeSingle();
      
    if (userError) {
      throw userError;
    }
    
    if (!userData?.id_negocio) {
      console.log('Usuário não tem negócio associado');
      return null;
    }
    
    console.log(`ID do negócio encontrado: ${userData.id_negocio}`);
    
    // Fetch the business details
    const { data: businessData, error: businessError } = await supabase
      .from('negocios')
      .select('*')
      .eq('id', userData.id_negocio)
      .maybeSingle();
      
    if (businessError) {
      throw businessError;
    }
    
    if (businessData) {
      console.log(`Dados do negócio recuperados: ${businessData.nome}, status: ${businessData.status}`);
    }
    
    // Store in cache
    localStorage.setItem(cacheKey, JSON.stringify(businessData));
    localStorage.setItem(timestampKey, Date.now().toString());
    
    return businessData as Business;
  } catch (error: any) {
    console.error('Erro ao buscar dados do negócio:', error);
    return null;
  }
};

// Check if user needs onboarding
export const checkOnboardingStatus = async (userId: string, skipCache = false): Promise<OnboardingStatus> => {
  if (!userId) {
    return { needsOnboarding: false, businessId: null };
  }
  
  try {
    // Check cache first
    const cacheKey = CACHE_KEYS.ONBOARDING_STATUS(userId);
    const timestampKey = `${cacheKey}-timestamp`;
    
    if (!skipCache) {
      const cachedStatus = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(timestampKey);
      
      if (cachedStatus && cachedTimestamp && isCacheValid(cachedTimestamp)) {
        console.log("Usando status de onboarding em cache");
        return JSON.parse(cachedStatus);
      }
    }
    
    console.log(`Verificando status de onboarding para usuário ${userId}`);
    
    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id_negocio')
      .eq('id', userId)
      .maybeSingle();
      
    if (userError) {
      throw userError;
    }
    
    // If no business is associated, they need onboarding
    if (!userData || !userData.id_negocio) {
      console.log('Usuário não tem negócio associado, precisa de onboarding');
      const result = { needsOnboarding: true, businessId: null };
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem(timestampKey, Date.now().toString());
      return result;
    }
    
    console.log(`Verificando status do negócio ${userData.id_negocio}`);
    
    // Check business status
    const { data: businessData, error: businessError } = await supabase
      .from('negocios')
      .select('id, status')
      .eq('id', userData.id_negocio)
      .maybeSingle();
      
    if (businessError) {
      throw businessError;
    }
    
    // If business exists but status is 'pendente', they still need onboarding
    const needsOnboarding = !businessData || businessData.status === 'pendente';
    const result = { 
      needsOnboarding, 
      businessId: businessData?.id || null 
    };
    
    console.log(`Status de onboarding: ${needsOnboarding ? 'Precisa completar onboarding' : 'Onboarding completo'}, status do negócio: ${businessData?.status || 'N/A'}`);
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify(result));
    localStorage.setItem(timestampKey, Date.now().toString());
    
    return result;
  } catch (error: any) {
    console.error('Erro ao verificar status de onboarding:', error);
    return { needsOnboarding: false, businessId: null };
  }
};

// Update business status using first the direct update and falling back to the RPC if needed
export const updateBusinessStatus = async (businessId: string, newStatus: string): Promise<boolean> => {
  if (!businessId) return false;
  
  try {
    console.log(`Tentando atualizar status do negócio ${businessId} para ${newStatus}`);
    
    // First attempt: Update the business status directly
    const { error } = await supabase
      .from('negocios')
      .update({ status: newStatus, atualizado_em: new Date().toISOString() })
      .eq('id', businessId);
      
    if (error) {
      console.warn('Erro na primeira tentativa de atualização de status, tentando via RPC:', error);
      
      // Second attempt: Try using the RPC function as fallback
      const { data: rpcData, error: rpcError } = await supabase.rpc('set_business_status', {
        business_id: businessId,
        new_status: newStatus
      });
      
      if (rpcError) {
        throw rpcError;
      }
      
      console.log('Status atualizado com sucesso via RPC');
    } else {
      console.log('Status atualizado com sucesso via update direto');
    }
    
    // Clear all related caches to ensure fresh data
    clearBusinessCache();
    
    return true;
  } catch (error: any) {
    console.error('Erro ao atualizar status do negócio:', error);
    toast.error('Erro ao atualizar status do negócio.');
    return false;
  }
};

// Function to verify business status and attempt repair if needed
export const verifyAndRepairBusinessStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Verificando e tentando reparar status do negócio para usuário ${userId}`);
    
    // Get user's business
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id_negocio')
      .eq('id', userId)
      .maybeSingle();
      
    if (userError || !userData?.id_negocio) {
      console.log('Usuário não tem negócio associado ou ocorreu um erro');
      return false;
    }
    
    // Check business status
    const { data: businessData, error: businessError } = await supabase
      .from('negocios')
      .select('id, status')
      .eq('id', userData.id_negocio)
      .maybeSingle();
      
    if (businessError || !businessData) {
      console.log('Erro ao verificar status do negócio ou negócio não encontrado');
      return false;
    }
    
    // If status is "pendente", try to update it
    if (businessData.status === 'pendente') {
      console.log('Negócio encontrado com status pendente, tentando corrigir');
      return await updateBusinessStatus(businessData.id, 'ativo');
    }
    
    console.log(`Negócio já tem status correto: ${businessData.status}`);
    return true;
  } catch (error: any) {
    console.error('Erro ao verificar e reparar status:', error);
    return false;
  }
};

// Clear business cache
export const clearBusinessCache = (): void => {
  console.log('Limpando cache de dados do negócio');
  
  // Find and remove all business-related cache items
  Object.keys(localStorage).forEach(key => {
    if (key.includes('business-') || 
        key.includes('onboarding-status-') || 
        key.includes('tenant-business-')) {
      localStorage.removeItem(key);
      console.log(`Cache removido: ${key}`);
    }
  });
};
