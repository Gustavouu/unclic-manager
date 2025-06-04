
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppointmentService } from '../appointmentService';
import { supabase } from '@/lib/supabase';
import type { PostgrestResponse } from '@supabase/supabase-js';

// Mock do Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: mockAppointment,
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
              data: mockAppointment,
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
            data: mockAppointment,
            error: null,
            count: null,
            status: 200,
            statusText: 'OK',
          })),
        })),
        gte: vi.fn(() => ({
          lte: vi.fn(() => ({
            data: [mockAppointment],
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
    rpc: vi.fn(() => ({
      data: mockStats,
      error: null,
      count: null,
      status: 200,
      statusText: 'OK',
    })),
  },
}));

// Mock dos dados corrigido
const mockAppointmentData = {
  business_id: '1',
  client_id: '1',
  professional_id: '1',
  service_id: '1',
  date: '2024-01-01',
  start_time: '10:00:00',
  end_time: '11:00:00',
  duration: 60,
  price: 100,
  status: 'scheduled' as const,
  payment_method: 'credit_card',
  notes: 'Test Notes',
};

const mockAppointment = {
  id: '1',
  business_id: '1',
  client_id: '1',
  professional_id: '1',
  service_id: '1',
  date: '2024-01-01',
  start_time: '10:00:00',
  end_time: '11:00:00',
  duration: 60,
  price: 100,
  status: 'scheduled' as const,
  payment_method: 'credit_card',
  payment_status: 'pending' as const,
  notes: 'Test Notes',
  rating: null,
  feedback_comment: null,
  reminder_sent: false,
  client_name: 'Test Client',
  professional_name: 'Test Professional',
  service_name: 'Test Service',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockStats = {
  total: 100,
  scheduled: 20,
  confirmed: 30,
  completed: 40,
  cancelled: 5,
  no_show: 5,
  total_revenue: 10000,
  average_value: 100,
  completion_rate: 0.9,
  cancellation_rate: 0.05,
};

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(() => {
    service = AppointmentService.getInstance();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new appointment', async () => {
      const result = await service.create(mockAppointmentData);
      expect(result).toEqual(mockAppointment);
      expect(supabase.from).toHaveBeenCalledWith('Appointments');
    });
  });

  describe('update', () => {
    it('should update an existing appointment', async () => {
      const result = await service.update('1', { status: 'confirmed' });
      expect(result).toEqual(mockAppointment);
      expect(supabase.from).toHaveBeenCalledWith('Appointments');
    });

    it('should check for conflicts when updating time', async () => {
      // Mock getById to return current appointment
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: mockAppointment,
              error: null,
            })),
          })),
        })),
      } as any);

      const result = await service.update('1', { start_time: '10:00:00' });
      expect(result).toEqual(mockAppointment);
    });
  });

  describe('getById', () => {
    it('should get an appointment by id', async () => {
      const result = await service.getById('1');
      expect(result).toEqual(mockAppointment);
      expect(supabase.from).toHaveBeenCalledWith('Appointments');
    });
  });

  describe('search', () => {
    it('should search appointments with all parameters', async () => {
      const searchParams = {
        business_id: '1',
        client_id: '1',
        professional_id: '1',
        service_id: '1',
        status: 'scheduled' as const,
        date_from: '2024-01-01',
        date_to: '2024-01-31',
        start_time: '10:00',
        end_time: '18:00',
      };

      const result = await service.search(searchParams);
      expect(result).toEqual([mockAppointment]);
      expect(supabase.from).toHaveBeenCalledWith('Appointments');
    });
  });

  describe('delete', () => {
    it('should delete an appointment', async () => {
      await service.delete('1');
      expect(supabase.from).toHaveBeenCalledWith('Appointments');
    });
  });

  describe('updateStatus', () => {
    it('should update appointment status', async () => {
      const result = await service.updateStatus('1', 'canceled', 'Client cancelled', 50);
      expect(result).toEqual(mockAppointment);
      expect(supabase.from).toHaveBeenCalledWith('Appointments');
    });
  });

  describe('getStats', () => {
    it('should get appointment stats', async () => {
      const result = await service.getStats('1');
      expect(result).toEqual(mockStats);
      expect(supabase.from).toHaveBeenCalledWith('Appointments');
    });
  });
});
