import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BusinessService } from '../businessService';
import { supabase } from '@/lib/supabase';

// Mock do Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: mockBusiness,
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: mockBusiness,
              error: null,
            })),
          })),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: mockBusiness,
            error: null,
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null,
        })),
      })),
    })),
    rpc: vi.fn(() => ({
      data: mockStats,
      error: null,
    })),
  },
}));

// Mock dos dados
const mockBusiness = {
  id: '1',
  name: 'Test Business',
  slug: 'test-business',
  admin_email: 'admin@test.com',
  phone: '1234567890',
  zip_code: '12345',
  address: 'Test Address',
  address_number: '123',
  address_complement: 'Test Complement',
  neighborhood: 'Test Neighborhood',
  city: 'Test City',
  state: 'Test State',
  latitude: 0,
  longitude: 0,
  logo_url: 'test-logo.png',
  description: 'Test Description',
  ein: '123456789',
  legal_name: 'Test Legal Name',
  trade_name: 'Test Trade Name',
  status: 'active',
  subscription_status: 'trial',
  subscription_end_date: '2024-12-31',
  trial_end_date: '2024-12-31',
  timezone: 'America/Sao_Paulo',
  currency: 'BRL',
  language: 'pt-BR',
  settings: {
    allow_remote_queue: true,
    remote_queue_limit: 10,
    require_advance_payment: false,
    minimum_notice_time: 30,
    maximum_days_in_advance: 30,
    allow_simultaneous_appointments: true,
    require_manual_confirmation: false,
    block_no_show_clients: false,
    send_email_confirmation: true,
    send_reminders: true,
    reminder_hours: 24,
    send_followup_message: false,
    followup_hours: 2,
    cancellation_policy_hours: 24,
    no_show_fee: 0,
    primary_color: '#213858',
    secondary_color: '#33c3f0',
    logo_url: 'test-logo.png',
    banner_url: 'test-banner.png',
    cancellation_policy: 'Test Policy',
    cancellation_message: 'Test Message',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockStats = {
  totalClients: 100,
  totalAppointments: 500,
  totalRevenue: 10000,
  activeProfessionals: 5,
};

describe('BusinessService', () => {
  let service: BusinessService;

  beforeEach(() => {
    service = BusinessService.getInstance();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new business', async () => {
      const result = await service.create(mockBusiness);
      expect(result).toEqual(mockBusiness);
      expect(supabase.from).toHaveBeenCalledWith('businesses');
    });
  });

  describe('update', () => {
    it('should update an existing business', async () => {
      const result = await service.update('1', { name: 'Updated Business' });
      expect(result).toEqual(mockBusiness);
      expect(supabase.from).toHaveBeenCalledWith('businesses');
    });
  });

  describe('getById', () => {
    it('should get a business by id', async () => {
      const result = await service.getById('1');
      expect(result).toEqual(mockBusiness);
      expect(supabase.from).toHaveBeenCalledWith('businesses');
    });
  });

  describe('listByUser', () => {
    it('should list businesses by user id', async () => {
      const result = await service.listByUser('user1');
      expect(result).toEqual([mockBusiness]);
      expect(supabase.from).toHaveBeenCalledWith('businesses');
    });
  });

  describe('delete', () => {
    it('should delete a business', async () => {
      await service.delete('1');
      expect(supabase.from).toHaveBeenCalledWith('businesses');
    });
  });

  describe('checkAccess', () => {
    it('should check if user has access to business', async () => {
      const result = await service.checkAccess('1', 'user1');
      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('business_users');
    });
  });

  describe('updateSubscriptionStatus', () => {
    it('should update subscription status', async () => {
      const result = await service.updateSubscriptionStatus('1', 'active');
      expect(result).toEqual(mockBusiness);
      expect(supabase.from).toHaveBeenCalledWith('businesses');
    });
  });

  describe('updateSettings', () => {
    it('should update business settings', async () => {
      const result = await service.updateSettings('1', {
        allow_remote_queue: false,
      });
      expect(result).toEqual(mockBusiness);
      expect(supabase.from).toHaveBeenCalledWith('businesses');
    });
  });

  describe('getStats', () => {
    it('should get business stats', async () => {
      const result = await service.getStats('1');
      expect(result).toEqual(mockStats);
      expect(supabase.rpc).toHaveBeenCalledWith('get_business_stats', {
        business_id: '1',
      });
    });
  });
}); 