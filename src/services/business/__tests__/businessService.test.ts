
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { businessService } from '../businessService';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('BusinessService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createBusiness', () => {
    it('should create a new business', async () => {
      const mockBusiness = {
        id: '123',
        name: 'Test Business',
        slug: 'test-business',
        admin_email: 'test@example.com',
      };

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockBusiness,
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const result = await businessService.createBusiness({
        name: 'Test Business',
        admin_email: 'test@example.com',
      });

      expect(result).toEqual(mockBusiness);
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Business',
          admin_email: 'test@example.com',
        })
      );
    });
  });

  describe('updateBusinessSettings', () => {
    it('should update business settings', async () => {
      const mockSettings = {
        id: 'settings-123',
        business_id: '123',
        primary_color: '#000000',
        secondary_color: '#ffffff',
        allow_online_booking: true,
        require_advance_payment: false,
        minimum_notice_time: 30,
        maximum_days_in_advance: 30,
      };

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockSettings,
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate,
      } as any);

      const updateData = {
        primary_color: '#000000',
        secondary_color: '#ffffff',
        allow_online_booking: true,
        require_advance_payment: false,
        minimum_notice_time: 30,
        maximum_days_in_advance: 30,
      };

      const result = await businessService.updateBusinessSettings('123', updateData);

      expect(result).toEqual(mockSettings);
      expect(mockUpdate).toHaveBeenCalledWith(updateData);
    });
  });
});
