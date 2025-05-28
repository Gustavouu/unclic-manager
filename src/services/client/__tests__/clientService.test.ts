import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClientService } from '../clientService';
import { supabase } from '@/lib/supabase';

// Mock do Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: mockClient,
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: mockClient,
              error: null,
            })),
          })),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: mockClient,
            error: null,
          })),
        })),
        or: vi.fn(() => ({
          data: [mockClient],
          error: null,
        })),
        contains: vi.fn(() => ({
          data: [mockClient],
          error: null,
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
const mockClient = {
  id: '1',
  business_id: '1',
  name: 'Test Client',
  email: 'client@test.com',
  phone: '1234567890',
  birth_date: '1990-01-01',
  gender: 'male' as const,
  address: 'Test Address',
  address_number: '123',
  address_complement: 'Test Complement',
  neighborhood: 'Test Neighborhood',
  city: 'Test City',
  state: 'Test State',
  zip_code: '12345',
  notes: 'Test Notes',
  preferences: {
    preferred_professionals: ['1'],
    preferred_services: ['1'],
    preferred_payment_method: 'credit_card' as const,
    preferred_communication_channel: 'email' as const,
    preferred_appointment_time: 'morning' as const,
    preferred_appointment_day: 'monday' as const,
    send_reminders: true,
    send_followup: true,
    send_promotions: true,
    send_birthday_greeting: true,
    notes: 'Test Preferences Notes',
  },
  status: 'active' as const,
  last_appointment: '2024-01-01T00:00:00Z',
  total_appointments: 10,
  total_spent: 1000,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockStats = {
  totalAppointments: 10,
  totalSpent: 1000,
  averageAppointmentValue: 100,
  lastAppointmentDate: '2024-01-01T00:00:00Z',
  favoriteService: '1',
  favoriteProfessional: '1',
  noShowCount: 0,
  cancellationCount: 1,
};

describe('ClientService', () => {
  let service: ClientService;

  beforeEach(() => {
    service = ClientService.getInstance();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const result = await service.create(mockClient);
      expect(result).toEqual(mockClient);
      expect(supabase.from).toHaveBeenCalledWith('clients');
    });
  });

  describe('update', () => {
    it('should update an existing client', async () => {
      const result = await service.update('1', { name: 'Updated Client' });
      expect(result).toEqual(mockClient);
      expect(supabase.from).toHaveBeenCalledWith('clients');
    });
  });

  describe('getById', () => {
    it('should get a client by id', async () => {
      const result = await service.getById('1');
      expect(result).toEqual(mockClient);
      expect(supabase.from).toHaveBeenCalledWith('clients');
    });
  });

  describe('listByBusiness', () => {
    it('should list clients by business id', async () => {
      const result = await service.listByBusiness('1');
      expect(result).toEqual([mockClient]);
      expect(supabase.from).toHaveBeenCalledWith('clients');
    });
  });

  describe('search', () => {
    it('should search clients by name or email', async () => {
      const result = await service.search('1', 'test');
      expect(result).toEqual([mockClient]);
      expect(supabase.from).toHaveBeenCalledWith('clients');
    });
  });

  describe('delete', () => {
    it('should delete a client', async () => {
      await service.delete('1');
      expect(supabase.from).toHaveBeenCalledWith('clients');
    });
  });

  describe('updateStatus', () => {
    it('should update client status', async () => {
      const result = await service.updateStatus('1', 'inactive');
      expect(result).toEqual(mockClient);
      expect(supabase.from).toHaveBeenCalledWith('clients');
    });
  });

  describe('updatePreferences', () => {
    it('should update client preferences', async () => {
      const result = await service.updatePreferences('1', {
        preferred_payment_method: 'pix',
      });
      expect(result).toEqual(mockClient);
      expect(supabase.from).toHaveBeenCalledWith('clients');
    });
  });

  describe('getStats', () => {
    it('should get client stats', async () => {
      const result = await service.getStats('1');
      expect(result).toEqual(mockStats);
      expect(supabase.rpc).toHaveBeenCalledWith('get_client_stats', {
        client_id: '1',
      });
    });
  });

  describe('listByPreferredProfessional', () => {
    it('should list clients by preferred professional', async () => {
      const result = await service.listByPreferredProfessional('1', '1');
      expect(result).toEqual([mockClient]);
      expect(supabase.from).toHaveBeenCalledWith('clients');
    });
  });

  describe('listByPreferredService', () => {
    it('should list clients by preferred service', async () => {
      const result = await service.listByPreferredService('1', '1');
      expect(result).toEqual([mockClient]);
      expect(supabase.from).toHaveBeenCalledWith('clients');
    });
  });
}); 