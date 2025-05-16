import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getBusinessData,
  checkOnboardingStatus,
  updateBusinessStatus,
  verifyAndRepairBusinessStatus,
  clearBusinessCache,
  CACHE_KEYS,
  type Business,
  type OnboardingStatus
} from '@/services/businessService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn()
  }
}));

// Mock do toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

// Mock do localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('BusinessService', () => {
  const mockUserId = 'user-123';
  const mockBusinessId = 'business-123';
  
  const mockBusiness: Business = {
    id: mockBusinessId,
    name: 'Test Business',
    slug: 'test-business',
    admin_email: 'admin@test.com',
    phone: '+5511999999999',
    address: 'Test Address',
    logo_url: 'https://example.com/logo.png',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('getBusinessData', () => {
    it('deve retornar null quando userId não é fornecido', async () => {
      const result = await getBusinessData('');
      expect(result).toBeNull();
      expect(toast.error).toHaveBeenCalled();
    });

    it('deve retornar dados do cache quando válidos', async () => {
      const cacheData = {
        data: mockBusiness,
        timestamp: Date.now()
      };
      localStorageMock.setItem('business_data', JSON.stringify(cacheData));

      const result = await getBusinessData(mockUserId);
      expect(result).toEqual(mockBusiness);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('deve buscar dados do servidor quando cache é inválido', async () => {
      const cacheData = {
        data: mockBusiness,
        timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 horas atrás
      };
      localStorageMock.setItem('business_data', JSON.stringify(cacheData));

      (supabase.from as any).mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockBusiness, error: null })
          })
        })
      }));

      const result = await getBusinessData(mockUserId, true);
      expect(result).toEqual(mockBusiness);
      expect(supabase.from).toHaveBeenCalledTimes(2);
    });
  });

  describe('checkOnboardingStatus', () => {
    it('deve retornar status de onboarding do cache quando válido', async () => {
      const cacheData = {
        data: { needsOnboarding: true, businessId: mockBusinessId },
        timestamp: Date.now()
      };
      localStorageMock.setItem('onboarding_status', JSON.stringify(cacheData));

      const result = await checkOnboardingStatus(mockUserId);
      expect(result).toEqual({
        needsOnboarding: true,
        businessId: mockBusinessId
      });
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('deve verificar status no servidor quando cache é inválido', async () => {
      const cacheData = {
        data: { needsOnboarding: true, businessId: mockBusinessId },
        timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 horas atrás
      };
      localStorageMock.setItem('onboarding_status', JSON.stringify(cacheData));

      (supabase.from as any).mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        })
      }));

      const result = await checkOnboardingStatus(mockUserId, true);
      expect(result).toEqual({
        needsOnboarding: true,
        businessId: null
      });
    });
  });

  describe('updateBusinessStatus', () => {
    it('deve retornar false quando businessId não é fornecido', async () => {
      const result = await updateBusinessStatus('', 'active');
      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalled();
    });

    it('deve retornar false quando status é inválido', async () => {
      const result = await updateBusinessStatus(mockBusinessId, 'invalid-status' as any);
      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalled();
    });

    it('deve atualizar status via RPC com sucesso', async () => {
      (supabase.rpc as any).mockImplementation(() => Promise.resolve({ data: true, error: null }));

      const result = await updateBusinessStatus(mockBusinessId, 'active');
      expect(result).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledWith('set_business_status', {
        business_id: mockBusinessId,
        new_status: 'active'
      });
      expect(toast.success).toHaveBeenCalled();
    });

    it('deve tentar atualização direta quando RPC falha', async () => {
      (supabase.rpc as any).mockImplementation(() => Promise.resolve({ data: null, error: new Error('RPC failed') }));
      (supabase.from as any).mockImplementation(() => ({
        update: () => ({
          eq: () => Promise.resolve({ data: mockBusiness, error: null })
        })
      }));

      const result = await updateBusinessStatus(mockBusinessId, 'active');
      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });

  describe('verifyAndRepairBusinessStatus', () => {
    it('deve retornar false quando userId não é fornecido', async () => {
      const result = await verifyAndRepairBusinessStatus('');
      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalled();
    });

    it('deve reparar status inválido automaticamente', async () => {
      (supabase.from as any).mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: { ...mockBusiness, status: 'invalid' }, error: null })
          })
        })
      }));
      (supabase.rpc as any).mockImplementation(() => Promise.resolve({ data: true, error: null }));

      const result = await verifyAndRepairBusinessStatus(mockUserId);
      expect(result).toBe(true);
      expect(supabase.rpc).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });

  describe('clearBusinessCache', () => {
    it('deve limpar todos os itens de cache relacionados ao negócio', () => {
      localStorageMock.setItem('business_data', 'test');
      localStorageMock.setItem('onboarding_status', 'test');
      localStorageMock.setItem('other-test', 'test');

      clearBusinessCache();

      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2);
      expect(localStorageMock.getItem('other-test')).toBe('test');
    });
  });
}); 