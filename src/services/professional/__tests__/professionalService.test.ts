import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfessionalService } from '../professionalService';
import { supabase } from '@/lib/supabase';
import type { PostgrestResponse } from '@supabase/supabase-js';

// Mock do Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: mockProfessional,
            error: null,
            count: null,
            status: 200,
            statusText: 'OK',
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: mockProfessional,
              error: null,
              count: null,
              status: 200,
              statusText: 'OK',
            })),
          })),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: mockProfessional,
            error: null,
            count: null,
            status: 200,
            statusText: 'OK',
          })),
        })),
        contains: vi.fn(() => ({
          gte: vi.fn(() => ({
            or: vi.fn(() => ({
              data: [mockProfessional],
              error: null,
              count: null,
              status: 200,
              statusText: 'OK',
            })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null,
          count: null,
          status: 200,
          statusText: 'OK',
        })),
      })),
    })),
    rpc: vi.fn(() => ({
      data: mockStats,
      error: null,
      count: null,
      status: 200,
      statusText: 'OK',
    })),
  },
}));

// Mock dos dados
const mockProfessional = {
  id: '1',
  business_id: '1',
  user_id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+5511999999999',
  avatar_url: null,
  bio: 'Professional bio',
  specialties: ['haircut', 'coloring'],
  working_hours: {
    monday: [{ start: '09:00', end: '18:00' }],
    tuesday: [{ start: '09:00', end: '18:00' }],
    wednesday: [{ start: '09:00', end: '18:00' }],
    thursday: [{ start: '09:00', end: '18:00' }],
    friday: [{ start: '09:00', end: '18:00' }],
    saturday: [{ start: '09:00', end: '14:00' }],
    sunday: [],
  },
  status: 'active' as const,
  rating: 4.5,
  total_reviews: 10,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockStats = {
  totalAppointments: 100,
  completedAppointments: 80,
  cancelledAppointments: 10,
  noShowAppointments: 10,
  averageRating: 4.5,
  totalRevenue: 10000,
  mostPopularService: '1',
  busiestDay: 'monday',
  busiestTime: '10:00',
};

describe('ProfessionalService', () => {
  let service: ProfessionalService;

  beforeEach(() => {
    service = ProfessionalService.getInstance();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new professional', async () => {
      const result = await service.create(mockProfessional);
      expect(result).toEqual(mockProfessional);
      expect(supabase.from).toHaveBeenCalledWith('professionals');
    });
  });

  describe('update', () => {
    it('should update an existing professional', async () => {
      const result = await service.update('1', { name: 'Jane Doe' });
      expect(result).toEqual(mockProfessional);
      expect(supabase.from).toHaveBeenCalledWith('professionals');
    });
  });

  describe('getById', () => {
    it('should get a professional by id', async () => {
      const result = await service.getById('1');
      expect(result).toEqual(mockProfessional);
      expect(supabase.from).toHaveBeenCalledWith('professionals');
    });
  });

  describe('search', () => {
    it('should search professionals with all parameters', async () => {
      const searchParams = {
        business_id: '1',
        status: 'active' as const,
        specialty: 'haircut',
        rating: 4,
        search: 'John',
      };

      const result = await service.search(searchParams);
      expect(result).toEqual([mockProfessional]);
      expect(supabase.from).toHaveBeenCalledWith('professionals');
    });
  });

  describe('delete', () => {
    it('should delete a professional', async () => {
      await service.delete('1');
      expect(supabase.from).toHaveBeenCalledWith('professionals');
    });
  });

  describe('updateStatus', () => {
    it('should update professional status', async () => {
      const result = await service.updateStatus('1', 'inactive');
      expect(result).toEqual(mockProfessional);
      expect(supabase.from).toHaveBeenCalledWith('professionals');
    });
  });

  describe('updateRating', () => {
    it('should update professional rating', async () => {
      const result = await service.updateRating('1', 5);
      expect(result).toEqual(mockProfessional);
      expect(supabase.from).toHaveBeenCalledWith('professionals');
    });

    it('should update professional rating without incrementing reviews', async () => {
      const result = await service.updateRating('1', 5, false);
      expect(result).toEqual(mockProfessional);
      expect(supabase.from).toHaveBeenCalledWith('professionals');
    });
  });

  describe('getStats', () => {
    it('should get professional stats', async () => {
      const result = await service.getStats('1');
      expect(result).toEqual(mockStats);
      expect(supabase.rpc).toHaveBeenCalledWith('get_professional_stats', {
        professional_id: '1',
      });
    });
  });

  describe('getAvailability', () => {
    it('should get professional availability', async () => {
      const mockAppointments = {
        data: [
          {
            start_time: '2024-01-01T10:00:00Z',
            end_time: '2024-01-01T11:00:00Z',
          },
        ],
        error: null,
        count: null,
        status: 200,
        statusText: 'OK',
      };

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lt: vi.fn().mockReturnThis(),
        data: mockAppointments.data,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK',
      } as any);

      const result = await service.getAvailability('1', '2024-01-01');
      expect(result).toEqual({
        date: '2024-01-01',
        available_slots: [],
        unavailable_slots: [{ start: '09:00', end: '18:00' }],
      });
    });
  });
}); 