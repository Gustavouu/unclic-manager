
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
  nome?: string;
  name?: string;
  slug: string;
  email_admin?: string;
  admin_email?: string;
  telefone?: string;
  phone?: string;
  endereco?: string;
  address?: string;
  url_logo?: string;
  logo_url?: string;
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
    
    // Try business_users table first (standardized table)
    const { data: userData, error: userError } = await supabase
      .from('business_users')
      .select('business_id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (userError) {
      console.warn('Erro ao buscar em business_users:', userError);
    }
    
    let businessId = userData?.business_id;
    
    if (!businessId) {
      console.log('Usuário não tem negócio associado em business_users');
      return null;
    }
    
    console.log(`ID do negócio encontrado: ${businessId}`);
    
    // Fetch the business details from businesses table
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .maybeSingle();
      
    if (businessError) {
      console.warn('Erro ao buscar em businesses:', businessError);
      return null;
    }
    
    if (businessData) {
      console.log(`Dados do negócio recuperados: ${businessData.name}, status: ${businessData.status}`);
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
    
    // Fetch user data from business_users
    const { data: userData, error: userError } = await supabase
      .from('business_users')
      .select('business_id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (userError) {
      console.warn('Erro ao buscar usuário:', userError);
    }
    
    // If no business is associated, they need onboarding
    if (!userData || !userData.business_id) {
      console.log('Usuário não tem negócio associado, precisa de onboarding');
      const result = { needsOnboarding: true, businessId: null };
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem(timestampKey, Date.now().toString());
      return result;
    }
    
    console.log(`Verificando status do negócio ${userData.business_id}`);
    
    // Check business status
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('id, status')
      .eq('id', userData.business_id)
      .maybeSingle();
      
    if (businessError) {
      console.warn('Erro ao buscar negócio:', businessError);
    }
    
    // If business exists but status is 'trial' or inactive, they still need onboarding
    const needsOnboarding = !businessData || businessData.status === 'trial' || businessData.status === 'inactive';
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

// Update business status
export const updateBusinessStatus = async (businessId: string, newStatus: string): Promise<boolean> => {
  if (!businessId) return false;
  
  try {
    console.log(`Tentando atualizar status do negócio ${businessId} para ${newStatus}`);
    
    const { error } = await supabase
      .from('businesses')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString() 
      })
      .eq('id', businessId);
      
    if (error) {
      console.error('Erro ao atualizar status do negócio:', error);
      throw error;
    }
    
    console.log('Status atualizado com sucesso');
    clearBusinessCache();
    return true;
  } catch (error: any) {
    console.error('Erro ao atualizar status do negócio:', error);
    throw new Error(`Erro ao atualizar status do negócio: ${error.message || 'Erro desconhecido'}`);
  }
};

// Function to verify business status and attempt repair if needed
export const verifyAndRepairBusinessStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Verificando e tentando reparar status do negócio para usuário ${userId}`);
    
    // Get user's business from business_users
    const { data: userData, error: userError } = await supabase
      .from('business_users')
      .select('business_id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (userError || !userData?.business_id) {
      console.log('Usuário não tem negócio associado ou ocorreu um erro');
      return false;
    }
    
    // Check business status
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('id, status')
      .eq('id', userData.business_id)
      .maybeSingle();
      
    if (businessError || !businessData) {
      console.log('Erro ao verificar status do negócio ou negócio não encontrado');
      return false;
    }
    
    // If status is "trial", try to update it
    if (businessData.status === 'trial') {
      console.log('Negócio encontrado com status trial, tentando corrigir');
      return await updateBusinessStatus(businessData.id, 'active');
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
