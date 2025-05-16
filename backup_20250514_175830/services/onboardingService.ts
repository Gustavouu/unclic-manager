import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { metricsService } from "./monitoring/MetricsService";
import type { Business } from "./businessService";

export interface OnboardingData {
  business: {
    name: string;
    slug: string;
    admin_email: string;
    phone?: string;
    address?: string;
    logo_url?: string;
  };
  user: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface OnboardingValidation {
  isValid: boolean;
  errors: {
    business?: {
      name?: string;
      slug?: string;
      admin_email?: string;
      phone?: string;
      address?: string;
    };
    user?: {
      full_name?: string;
    };
  };
}

class OnboardingService {
  private static instance: OnboardingService;
  private readonly CACHE_KEY = 'onboarding_progress';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

  private constructor() {}

  public static getInstance(): OnboardingService {
    if (!OnboardingService.instance) {
      OnboardingService.instance = new OnboardingService();
    }
    return OnboardingService.instance;
  }

  // Validar dados do onboarding
  public validateOnboardingData(data: OnboardingData): OnboardingValidation {
    const errors: OnboardingValidation['errors'] = {};
    let isValid = true;

    // Validar dados do negócio
    if (!data.business.name?.trim()) {
      errors.business = { ...errors.business, name: 'Nome do negócio é obrigatório' };
      isValid = false;
    }

    if (!data.business.slug?.trim()) {
      errors.business = { ...errors.business, slug: 'Slug é obrigatório' };
      isValid = false;
    } else if (!/^[a-z0-9-]+$/.test(data.business.slug)) {
      errors.business = { ...errors.business, slug: 'Slug deve conter apenas letras minúsculas, números e hífens' };
      isValid = false;
    }

    if (!data.business.admin_email?.trim()) {
      errors.business = { ...errors.business, admin_email: 'Email do administrador é obrigatório' };
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.business.admin_email)) {
      errors.business = { ...errors.business, admin_email: 'Email inválido' };
      isValid = false;
    }

    if (data.business.phone && !/^\+?[\d\s-]{10,}$/.test(data.business.phone)) {
      errors.business = { ...errors.business, phone: 'Telefone inválido' };
      isValid = false;
    }

    // Validar dados do usuário
    if (!data.user.full_name?.trim()) {
      errors.user = { ...errors.user, full_name: 'Nome completo é obrigatório' };
      isValid = false;
    }

    return { isValid, errors };
  }

  // Salvar progresso do onboarding
  public saveProgress(data: Partial<OnboardingData>): void {
    try {
      const currentProgress = this.getProgress();
      const updatedProgress = { ...currentProgress, ...data };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({
        data: updatedProgress,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Erro ao salvar progresso do onboarding:', error);
    }
  }

  // Recuperar progresso do onboarding
  public getProgress(): Partial<OnboardingData> {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return {};

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return {};
      }

      return data;
    } catch (error) {
      console.error('Erro ao recuperar progresso do onboarding:', error);
      return {};
    }
  }

  // Limpar progresso do onboarding
  public clearProgress(): void {
    localStorage.removeItem(this.CACHE_KEY);
  }

  // Verificar se slug está disponível
  public async isSlugAvailable(slug: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return !data;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade do slug:', error);
      return false;
    }
  }

  // Completar onboarding
  public async completeOnboarding(data: OnboardingData): Promise<boolean> {
    const startTime = Date.now();
    const validation = this.validateOnboardingData(data);

    if (!validation.isValid) {
      metricsService.recordApiMetric(false, 'completeOnboarding', Date.now() - startTime);
      toast.error('Por favor, corrija os erros antes de continuar');
      return false;
    }

    try {
      // Verificar disponibilidade do slug
      const isAvailable = await this.isSlugAvailable(data.business.slug);
      if (!isAvailable) {
        toast.error('Este slug já está em uso. Por favor, escolha outro.');
        metricsService.recordApiMetric(false, 'completeOnboarding', Date.now() - startTime);
        return false;
      }

      // Obter usuário atual
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuário não autenticado');

      // Iniciar transação
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert({
          name: data.business.name,
          slug: data.business.slug,
          admin_email: data.business.admin_email,
          phone: data.business.phone,
          address: data.business.address,
          logo_url: data.business.logo_url,
          status: 'pending'
        })
        .select()
        .single();

      if (businessError) throw businessError;

      // Atualizar dados do usuário
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: data.user.full_name,
          avatar_url: data.user.avatar_url
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Criar associação entre usuário e negócio
      const { error: associationError } = await supabase
        .from('business_users')
        .insert({
          business_id: business.id,
          user_id: user.id,
          role: 'admin'
        });

      if (associationError) throw associationError;

      // Limpar cache e progresso
      this.clearProgress();

      metricsService.recordApiMetric(true, 'completeOnboarding', Date.now() - startTime);
      toast.success('Onboarding concluído com sucesso!');
      return true;

    } catch (error: any) {
      console.error('Erro ao completar onboarding:', error);
      metricsService.recordApiMetric(false, 'completeOnboarding', Date.now() - startTime);
      toast.error('Erro ao completar onboarding. Por favor, tente novamente.');
      return false;
    }
  }

  // Verificar status do onboarding
  public async checkOnboardingStatus(): Promise<{
    isComplete: boolean;
    businessId: string | null;
    nextStep: string | null;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { isComplete: false, businessId: null, nextStep: 'login' };
      }

      const { data: userData, error: userError } = await supabase
        .from('business_users')
        .select('business_id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userError) throw userError;

      if (!userData) {
        return { isComplete: false, businessId: null, nextStep: 'business_info' };
      }

      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('status')
        .eq('id', userData.business_id)
        .single();

      if (businessError) throw businessError;

      if (businessData.status === 'pending') {
        return { 
          isComplete: false, 
          businessId: userData.business_id, 
          nextStep: 'complete_profile' 
        };
      }

      return { 
        isComplete: true, 
        businessId: userData.business_id, 
        nextStep: null 
      };

    } catch (error) {
      console.error('Erro ao verificar status do onboarding:', error);
      return { isComplete: false, businessId: null, nextStep: 'error' };
    }
  }
}

export const onboardingService = OnboardingService.getInstance(); 