import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceService } from '../serviceService';
import { supabase } from '@/lib/supabase';

// Mock do Supabase
vi.mock('@/lib/supabase', () => ({
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
        gte: vi.fn(() => ({
          lte: vi.fn(() => ({
            or: vi.fn(() => ({
              data: [mockService],
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
const mockService = {
  id: '1',
  business_id: '1',
  name: 'Corte de Cabelo',
  description: 'Corte de cabelo masculino',
  duration: 30,
  price: 50,
  category: '1',
  image_url: null,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockCategory = {
  id: '1',
  business_id: '1',
  name: 'Cabelo',
  description: 'Serviços de cabelo',
  image_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockStats = {
  totalAppointments: 100,
  totalRevenue: 5000,
  averagePrice: 50,
  mostPopularProfessional: '1',
  busiestDay: 'monday',
  busiestTime: '10:00',
};

const mockCategoryStats = {
  totalServices: 5,
  totalAppointments: 200,
  totalRevenue: 10000,
  averagePrice: 50,
  mostPopularService: '1',
  mostPopularProfessional: '1',
};

describe('ServiceService', () => {
  let service: ServiceService;

  beforeEach(() => {
    service = ServiceService.getInstance();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const result = await service.create(mockService);
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
    it('should search services with all parameters', async () => {
      const searchParams = {
        business_id: '1',
        category: '1',
        min_price: 30,
        max_price: 100,
        min_duration: 15,
        max_duration: 60,
        is_active: true,
        search: 'Corte',
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
      expect(supabase.rpc).toHaveBeenCalledWith('get_service_stats', {
        service_id: '1',
      });
    });
  });

  describe('createCategory', () => {
    it('should create a new service category', async () => {
      const result = await service.createCategory(mockCategory);
      expect(result).toEqual(mockCategory);
      expect(supabase.from).toHaveBeenCalledWith('service_categories');
    });
  });

  describe('updateCategory', () => {
    it('should update an existing service category', async () => {
      const result = await service.updateCategory('1', { name: 'Cabelo e Barba' });
      expect(result).toEqual(mockCategory);
      expect(supabase.from).toHaveBeenCalledWith('service_categories');
    });
  });

  describe('getCategoryById', () => {
    it('should get a service category by id', async () => {
      const result = await service.getCategoryById('1');
      expect(result).toEqual(mockCategory);
      expect(supabase.from).toHaveBeenCalledWith('service_categories');
    });
  });

  describe('listCategories', () => {
    it('should list service categories', async () => {
      const result = await service.listCategories('1');
      expect(result).toEqual([mockCategory]);
      expect(supabase.from).toHaveBeenCalledWith('service_categories');
    });
  });

  describe('deleteCategory', () => {
    it('should delete a service category', async () => {
      await service.deleteCategory('1');
      expect(supabase.from).toHaveBeenCalledWith('service_categories');
    });
  });

  describe('getCategoryStats', () => {
    it('should get service category stats', async () => {
      const result = await service.getCategoryStats('1');
      expect(result).toEqual(mockCategoryStats);
      expect(supabase.rpc).toHaveBeenCalledWith('get_service_category_stats', {
        category_id: '1',
      });
    });
  });
}); 