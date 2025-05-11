
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
        console.log("Using cached business data");
        return JSON.parse(cachedBusiness);
      }
    }
    
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
      return null;
    }
    
    // Fetch the business details
    const { data: businessData, error: businessError } = await supabase
      .from('negocios')
      .select('*')
      .eq('id', userData.id_negocio)
      .maybeSingle();
      
    if (businessError) {
      throw businessError;
    }
    
    // Store in cache
    localStorage.setItem(cacheKey, JSON.stringify(businessData));
    localStorage.setItem(timestampKey, Date.now().toString());
    
    return businessData as Business;
  } catch (error: any) {
    console.error('Error fetching business data:', error);
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
        console.log("Using cached onboarding status");
        return JSON.parse(cachedStatus);
      }
    }
    
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
      const result = { needsOnboarding: true, businessId: null };
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem(timestampKey, Date.now().toString());
      return result;
    }
    
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
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify(result));
    localStorage.setItem(timestampKey, Date.now().toString());
    
    return result;
  } catch (error: any) {
    console.error('Error checking onboarding status:', error);
    return { needsOnboarding: false, businessId: null };
  }
};

// Update business status
export const updateBusinessStatus = async (businessId: string, newStatus: string): Promise<boolean> => {
  if (!businessId) return false;
  
  try {
    // Update the business status
    const { error } = await supabase
      .from('negocios')
      .update({ status: newStatus })
      .eq('id', businessId);
      
    if (error) {
      throw error;
    }
    
    // Clear all related caches to ensure fresh data
    clearBusinessCache();
    
    return true;
  } catch (error: any) {
    console.error('Error updating business status:', error);
    toast.error('Erro ao atualizar status do negócio.');
    return false;
  }
};

// Clear business cache
export const clearBusinessCache = (): void => {
  // Find and remove all business-related cache items
  Object.keys(localStorage).forEach(key => {
    if (key.includes('business-') || 
        key.includes('onboarding-status-') || 
        key.includes('tenant-business-')) {
      localStorage.removeItem(key);
    }
  });
};
