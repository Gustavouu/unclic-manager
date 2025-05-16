import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { ToastT } from "sonner";
import { metricsService } from "./monitoring/MetricsService";
import { Business, BusinessSettings } from '@/types/business';

// Cache keys
export const CACHE_KEYS = {
  BUSINESS: (userId: string) => `business-${userId}`,
  BUSINESS_STATUS: (userId: string) => `business-status-${userId}`,
  ONBOARDING_STATUS: (userId: string) => `onboarding-status-${userId}`,
};

// Cache duration in milliseconds
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Types
export type OnboardingStatus = {
  needsOnboarding: boolean;
  businessId: string | null;
};

// Função melhorada para validar cache
const isCacheValid = (timestamp: string): boolean => {
  try {
    const cachedTime = parseInt(timestamp);
    const now = Date.now();
    return !isNaN(cachedTime) && now - cachedTime < CACHE_DURATION;
  } catch (error) {
    console.error('Erro ao validar cache:', error);
    return false;
  }
};

// Função para validar dados do negócio
const validateBusinessData = (data: any): data is Business => {
  if (!data) return false;
  
  const requiredFields = ['id', 'name', 'slug', 'admin_email', 'status'];
  const validStatuses = ['pending', 'active', 'inactive', 'suspended'];
  
  return requiredFields.every(field => data[field] !== undefined && data[field] !== null) &&
         validStatuses.includes(data.status);
};

// Get business data with improved error handling and validation
export const getBusinessData = async (userId: string, skipCache = false): Promise<Business | null> => {
  const startTime = Date.now();
  
  if (!userId) {
    console.warn('Tentativa de buscar dados do negócio sem userId');
    metricsService.recordApiMetric(false, 'getBusinessData', Date.now() - startTime);
    return null;
  }
  
  try {
    // Check cache first
    const cacheKey = CACHE_KEYS.BUSINESS(userId);
    const timestampKey = `${cacheKey}-timestamp`;
    
    if (!skipCache) {
      const cachedBusiness = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(timestampKey);
      
      if (cachedBusiness && cachedTimestamp && isCacheValid(cachedTimestamp)) {
        const parsedBusiness = JSON.parse(cachedBusiness);
        if (validateBusinessData(parsedBusiness)) {
          console.log("Usando dados em cache do negócio");
          metricsService.recordCacheMetric('hit', cacheKey);
          metricsService.recordApiMetric(true, 'getBusinessData', Date.now() - startTime);
          return parsedBusiness;
        } else {
          console.warn("Dados em cache inválidos, buscando do servidor");
          metricsService.recordCacheMetric('error', cacheKey);
          clearBusinessCache();
        }
      } else {
        metricsService.recordCacheMetric('miss', cacheKey);
      }
    }
    
    console.log(`Buscando dados do negócio para o usuário ${userId}`);
    
    // Get the user's associated business
    const { data: userData, error: userError } = await supabase
      .from('business_users')
      .select('business_id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (userError) {
      throw userError;
    }
    
    if (!userData?.business_id) {
      console.log('Usuário não tem negócio associado');
      return null;
    }
    
    console.log(`ID do negócio encontrado: ${userData.business_id}`);
    
    // Fetch the business details
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', userData.business_id)
      .maybeSingle();
      
    if (businessError) {
      throw businessError;
    }
    
    if (businessData) {
      if (!validateBusinessData(businessData)) {
        throw new Error('Dados do negócio inválidos retornados do servidor');
      }
      
      // Store in cache only if data is valid
      localStorage.setItem(cacheKey, JSON.stringify(businessData));
      localStorage.setItem(timestampKey, Date.now().toString());
      
      metricsService.recordApiMetric(true, 'getBusinessData', Date.now() - startTime);
      return businessData as Business;
    }
    
    metricsService.recordApiMetric(false, 'getBusinessData', Date.now() - startTime);
    return null;
  } catch (error: any) {
    console.error('Erro ao buscar dados do negócio:', error);
    metricsService.recordApiMetric(false, 'getBusinessData', Date.now() - startTime);
    toast.error('Erro ao carregar dados do negócio. Por favor, tente novamente.');
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
      .from('business_users')
      .select('business_id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (userError) {
      throw userError;
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
      throw businessError;
    }
    
    // If business exists but status is 'pending', they still need onboarding
    const needsOnboarding = !businessData || businessData.status === 'pending';
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

// Função para validar status do negócio
const isValidBusinessStatus = (status: string): boolean => {
  const validStatuses = ['pending', 'active', 'inactive', 'suspended'];
  return validStatuses.includes(status);
};

// Função para sanitizar dados do negócio
const sanitizeBusinessData = (data: Partial<Business>): Partial<Business> => {
  const sanitized: Partial<Business> = {};
  
  if (data.name) sanitized.name = data.name.trim();
  if (data.slug) sanitized.slug = data.slug.trim().toLowerCase();
  if (data.admin_email) sanitized.admin_email = data.admin_email.trim().toLowerCase();
  if (data.phone) sanitized.phone = data.phone.replace(/\D/g, '');
  if (data.address) sanitized.address = data.address.trim();
  if (data.logo_url) sanitized.logo_url = data.logo_url.trim();
  
  return sanitized;
};

// Update business status with improved error handling and validation
export const updateBusinessStatus = async (businessId: string, newStatus: string): Promise<boolean> => {
  const startTime = Date.now();
  
  if (!businessId) {
    toast.error('ID do negócio não fornecido');
    metricsService.recordApiMetric(false, 'updateBusinessStatus', Date.now() - startTime);
    return false;
  }
  
  if (!isValidBusinessStatus(newStatus)) {
    toast.error('Status inválido para o negócio');
    metricsService.recordApiMetric(false, 'updateBusinessStatus', Date.now() - startTime);
    return false;
  }
  
  try {
    console.log(`Tentando atualizar status do negócio ${businessId} para ${newStatus}`);
    
    // First attempt: Try using the RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc('set_business_status', {
      business_id: businessId,
      new_status: newStatus
    });
    
    if (!rpcError) {
      console.log('Status atualizado com sucesso via RPC');
      clearBusinessCache();
      toast.success('Status do negócio atualizado com sucesso');
      metricsService.recordApiMetric(true, 'updateBusinessStatus', Date.now() - startTime);
      return true;
    }
    
    // Second attempt: Direct update if RPC fails
    console.log("Método 2: Tentando atualização direta");
    metricsService.recordRecoveryMetric(true, 'updateBusinessStatus_fallback');
    
    const { error: updateError } = await supabase
      .from('businesses')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId);
    
    if (updateError) {
      throw updateError;
    }
    
    console.log('Status atualizado com sucesso via atualização direta');
    clearBusinessCache();
    toast.success('Status do negócio atualizado com sucesso');
    metricsService.recordApiMetric(true, 'updateBusinessStatus', Date.now() - startTime);
    return true;
    
  } catch (error: any) {
    console.error('Erro ao atualizar status do negócio:', error);
    metricsService.recordApiMetric(false, 'updateBusinessStatus', Date.now() - startTime);
    metricsService.recordRecoveryMetric(false, 'updateBusinessStatus');
    toast.error('Erro ao atualizar status do negócio. Por favor, tente novamente.');
    return false;
  }
};

// Verify and repair business status with improved error handling
export const verifyAndRepairBusinessStatus = async (userId: string): Promise<boolean> => {
  const startTime = Date.now();
  
  if (!userId) {
    console.warn('Tentativa de verificar status do negócio sem userId');
    metricsService.recordApiMetric(false, 'verifyAndRepairBusinessStatus', Date.now() - startTime);
    return false;
  }
  
  try {
    const businessData = await getBusinessData(userId, true);
    
    if (!businessData) {
      console.log('Nenhum negócio encontrado para o usuário');
      metricsService.recordApiMetric(false, 'verifyAndRepairBusinessStatus', Date.now() - startTime);
      return false;
    }
    
    if (!isValidBusinessStatus(businessData.status)) {
      console.warn(`Status inválido detectado: ${businessData.status}`);
      metricsService.recordRecoveryMetric(true, 'verifyAndRepairBusinessStatus_attempt');
      
      // Attempt to repair the status
      const repairSuccess = await updateBusinessStatus(businessData.id, 'pending');
      
      if (repairSuccess) {
        console.log('Status do negócio reparado com sucesso');
        toast.success('Status do negócio corrigido automaticamente');
        metricsService.recordRecoveryMetric(true, 'verifyAndRepairBusinessStatus_success');
        metricsService.recordApiMetric(true, 'verifyAndRepairBusinessStatus', Date.now() - startTime);
        return true;
      } else {
        console.error('Falha ao reparar status do negócio');
        metricsService.recordRecoveryMetric(false, 'verifyAndRepairBusinessStatus_failure');
        toast.error('Erro ao corrigir status do negócio. Por favor, contate o suporte.');
        metricsService.recordApiMetric(false, 'verifyAndRepairBusinessStatus', Date.now() - startTime);
        return false;
      }
    }
    
    metricsService.recordApiMetric(true, 'verifyAndRepairBusinessStatus', Date.now() - startTime);
    return true;
  } catch (error: any) {
    console.error('Erro ao verificar status do negócio:', error);
    metricsService.recordApiMetric(false, 'verifyAndRepairBusinessStatus', Date.now() - startTime);
    toast.error('Erro ao verificar status do negócio. Por favor, tente novamente.');
    return false;
  }
};

// Função para limpar cache de forma segura
export const clearBusinessCache = (): void => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('business-') || key.startsWith('business-status-') || key.startsWith('onboarding-status-')) {
        localStorage.removeItem(key);
      }
    });
    console.log('Cache do negócio limpo com sucesso');
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
};

export class BusinessService {
  static async getBusiness(businessId: string): Promise<Business | null> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getBusinessSettings(businessId: string): Promise<BusinessSettings | null> {
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .eq('business_id', businessId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBusinessSettings(
    businessId: string,
    settings: Partial<BusinessSettings>
  ): Promise<BusinessSettings> {
    const { data, error } = await supabase
      .from('business_settings')
      .update(settings)
      .eq('business_id', businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getBusinessUsers(businessId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async getBusinessClients(businessId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async getBusinessServices(businessId: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async getBusinessProfessionals(businessId: string) {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async getBusinessAppointments(businessId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        client:clients(*),
        professional:professionals(*),
        service:services(*)
      `)
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async createBusiness(business: Partial<Business>): Promise<Business> {
    const { data, error } = await supabase
      .from('businesses')
      .insert(business)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBusiness(
    businessId: string,
    business: Partial<Business>
  ): Promise<Business> {
    const { data, error } = await supabase
      .from('businesses')
      .update(business)
      .eq('id', businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteBusiness(businessId: string): Promise<void> {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', businessId);

    if (error) throw error;
  }
}
