
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceService } from '../serviceService';
import { supabase } from '@/integrations/supabase/client';

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: mockService,
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
              data: mockService,
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
            data: mockService,
            error: null,
            count: null,
            status: 200,
            statusText: 'OK',
          })),
        })),
        or: vi.fn(() => ({
          order: vi.fn(() => ({
            data: [mockService],
            error: null,
            count: null,
            status: 200,
            statusText: 'OK',
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
  },
}));

// Mock dos dados
const mockService = {
  id: '1',
  business_id: '1',
  name: 'Corte de Cabelo',
  description: 'Corte de cabelo masculino',
  duration: 30,
  price: 50,
  category: 'Cabelo',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockStats = {
  totalAppointments: 100,
  completedAppointments: 80,
  cancelledAppointments: 10,
  noShowAppointments: 10,
  totalRevenue: 5000,
  averageRating: 4.5,
  mostPopularDay: 'monday',
  mostPopularTime: '10:00',
};

describe('ServiceService', () => {
  let service: ServiceService;

  beforeEach(() => {
    service = ServiceService.getInstance();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const result = await service.create({
        business_id: '1',
        name: 'Corte de Cabelo',
        description: 'Corte de cabelo masculino',
        duration: 30,
        price: 50,
        category: 'Cabelo',
      });
      expect(result).toEqual(mockService);
      expect(supabase.from).toHaveBeenCalledWith('services');
    });
  });

  describe('update', () => {
    it('should update an existing service', async () => {
      const result = await service.update('1', { name: 'Corte Feminino' });
      expect(result).toEqual(mockService);
      expect(supabase.from).toHaveBeenCalledWith('services');
    });
  });

  describe('getById', () => {
    it('should get a service by id', async () => {
      const result = await service.getById('1');
      expect(result).toEqual(mockService);
      expect(supabase.from).toHaveBeenCalledWith('services');
    });
  });

  describe('search', () => {
    it('should search services with parameters', async () => {
      const searchParams = {
        business_id: '1',
        search: 'Corte',
        category: 'Cabelo',
        is_active: true,
      };

      const result = await service.search(searchParams);
      expect(result).toEqual([mockService]);
      expect(supabase.from).toHaveBeenCalledWith('services');
    });
  });

  describe('delete', () => {
    it('should delete a service', async () => {
      await service.delete('1');
      expect(supabase.from).toHaveBeenCalledWith('services');
    });
  });

  describe('updateStatus', () => {
    it('should update service status', async () => {
      const result = await service.updateStatus('1', false);
      expect(result).toEqual(mockService);
      expect(supabase.from).toHaveBeenCalledWith('services');
    });
  });

  describe('getStats', () => {
    it('should get service stats', async () => {
      const result = await service.getStats('1');
      expect(result).toEqual(mockStats);
    });
  });

  describe('getCategories', () => {
    it('should get service categories', async () => {
      const result = await service.getCategories('1');
      expect(result).toEqual(['Cabelo']);
    });
  });
});
