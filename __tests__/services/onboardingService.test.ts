import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onboardingService, type OnboardingData } from '@/services/onboardingService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

describe('OnboardingService', () => {
  const mockOnboardingData: OnboardingData = {
    business: {
      name: 'Test Business',
      slug: 'test-business',
      admin_email: 'admin@test.com',
      phone: '+5511999999999',
      address: 'Test Address',
      logo_url: 'https://example.com/logo.png'
    },
    user: {
      full_name: 'Test User',
      avatar_url: 'https://example.com/avatar.png'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('validateOnboardingData', () => {
    it('deve validar dados corretos', () => {
      const result = onboardingService.validateOnboardingData(mockOnboardingData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('deve rejeitar dados inválidos', () => {
      const invalidData = {
        ...mockOnboardingData,
        business: {
          ...mockOnboardingData.business,
          name: '',
          slug: 'invalid slug',
          admin_email: 'invalid-email'
        },
        user: {
          ...mockOnboardingData.user,
          full_name: ''
        }
      };

      const result = onboardingService.validateOnboardingData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.business?.name).toBeDefined();
      expect(result.errors.business?.slug).toBeDefined();
      expect(result.errors.business?.admin_email).toBeDefined();
      expect(result.errors.user?.full_name).toBeDefined();
    });
  });

  describe('saveProgress e getProgress', () => {
    it('deve salvar e recuperar progresso corretamente', () => {
      onboardingService.saveProgress(mockOnboardingData);
      const progress = onboardingService.getProgress();
      expect(progress).toEqual(mockOnboardingData);
    });

    it('deve limpar progresso expirado', () => {
      const expiredData = {
        data: mockOnboardingData,
        timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 horas atrás
      };
      localStorage.setItem('onboarding_progress', JSON.stringify(expiredData));
      
      const progress = onboardingService.getProgress();
      expect(progress).toEqual({});
      expect(localStorage.removeItem).toHaveBeenCalledWith('onboarding_progress');
    });
  });

  describe('isSlugAvailable', () => {
    it('deve retornar true para slug disponível', async () => {
      (supabase.from as any).mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null })
          })
        })
      }));

      const result = await onboardingService.isSlugAvailable('test-slug');
      expect(result).toBe(true);
    });

    it('deve retornar false para slug em uso', async () => {
      (supabase.from as any).mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: { id: 'business-123' }, error: null })
          })
        })
      }));

      const result = await onboardingService.isSlugAvailable('test-slug');
      expect(result).toBe(false);
    });
  });

  describe('completeOnboarding', () => {
    it('deve completar onboarding com sucesso', async () => {
      (supabase.from as any).mockImplementation((table: string) => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null })
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: 'business-123' }, error: null })
          })
        }),
        update: () => ({
          eq: () => Promise.resolve({ error: null })
        })
      }));

      const result = await onboardingService.completeOnboarding(mockOnboardingData);
      expect(result).toBe(true);
      expect(toast.success).toHaveBeenCalled();
    });

    it('deve falhar quando slug já está em uso', async () => {
      (supabase.from as any).mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: { id: 'business-123' }, error: null })
          })
        })
      }));

      const result = await onboardingService.completeOnboarding(mockOnboardingData);
      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('checkOnboardingStatus', () => {
    it('deve retornar status correto para usuário sem negócio', async () => {
      (supabase.from as any).mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null })
          })
        })
      }));

      const result = await onboardingService.checkOnboardingStatus();
      expect(result).toEqual({
        isComplete: false,
        businessId: null,
        nextStep: 'business_info'
      });
    });

    it('deve retornar status correto para negócio pendente', async () => {
      (supabase.from as any).mockImplementation((table: string) => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ 
              data: table === 'business_users' 
                ? { business_id: 'business-123', role: 'admin' }
                : { status: 'pending' },
              error: null 
            })
          })
        })
      }));

      const result = await onboardingService.checkOnboardingStatus();
      expect(result).toEqual({
        isComplete: false,
        businessId: 'business-123',
        nextStep: 'complete_profile'
      });
    });

    it('deve retornar status correto para onboarding completo', async () => {
      (supabase.from as any).mockImplementation((table: string) => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ 
              data: table === 'business_users' 
                ? { business_id: 'business-123', role: 'admin' }
                : { status: 'active' },
              error: null 
            })
          })
        })
      }));

      const result = await onboardingService.checkOnboardingStatus();
      expect(result).toEqual({
        isComplete: true,
        businessId: 'business-123',
        nextStep: null
      });
    });
  });
}); 