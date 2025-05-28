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

// Mock dos dados
const mockAppointment = {
  id: '1',
  business_id: '1',
  client_id: '1',
  professional_id: '1',
  service_id: '1',
  start_time: '2024-01-01T10:00:00Z',
  end_time: '2024-01-01T11:00:00Z',
  status: 'scheduled' as const,
  price: 100,
  payment_status: 'pending' as const,
  payment_method: 'credit_card' as const,
  notes: 'Test Notes',
  cancellation_reason: null,
  cancellation_fee: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockStats = {
  totalAppointments: 100,
  totalRevenue: 10000,
  averageAppointmentValue: 100,
  completionRate: 0.9,
  cancellationRate: 0.05,
  noShowRate: 0.05,
  mostPopularService: '1',
  mostPopularProfessional: '1',
  busiestDay: 'monday',
  busiestTime: '10:00',
};

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(() => {
    service = AppointmentService.getInstance();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new appointment', async () => {
      const result = await service.create(mockAppointment);
      expect(result).toEqual(mockAppointment);
      expect(supabase.from).toHaveBeenCalledWith('appointments');
    });

    it('should throw error if there are conflicts', async () => {
      const mockConflictResponse: PostgrestResponse<any> = {
        data: [{
          appointment_id: '2',
          professional_id: '1',
          start_time: '2024-01-01T10:00:00Z',
          end_time: '2024-01-01T11:00:00Z',
          conflict_type: 'professional',
          conflict_details: 'Professional has another appointment',
        }],
        error: null,
        count: null,
        status: 200,
        statusText: 'OK',
      };

      vi.mocked(supabase.rpc).mockResolvedValueOnce(mockConflictResponse);

      await expect(service.create(mockAppointment)).rejects.toThrow('Existem conflitos de horário');
    });
  });

  describe('update', () => {
    it('should update an existing appointment', async () => {
      const result = await service.update('1', { price: 150 });
      expect(result).toEqual(mockAppointment);
      expect(supabase.from).toHaveBeenCalledWith('appointments');
    });

    it('should check for conflicts when updating time', async () => {
      const mockConflictResponse: PostgrestResponse<any> = {
        data: [{
          appointment_id: '2',
          professional_id: '1',
          start_time: '2024-01-01T10:00:00Z',
          end_time: '2024-01-01T11:00:00Z',
          conflict_type: 'professional',
          conflict_details: 'Professional has another appointment',
        }],
        error: null,
        count: null,
        status: 200,
        statusText: 'OK',
      };

      vi.mocked(supabase.rpc).mockResolvedValueOnce(mockConflictResponse);

      await expect(service.update('1', { start_time: '2024-01-01T10:00:00Z' })).rejects.toThrow('Existem conflitos de horário');
    });
  });

  describe('getById', () => {
    it('should get an appointment by id', async () => {
      const result = await service.getById('1');
      expect(result).toEqual(mockAppointment);
      expect(supabase.from).toHaveBeenCalledWith('appointments');
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
        payment_status: 'pending' as const,
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        start_time: '10:00',
        end_time: '18:00',
      };

      const result = await service.search(searchParams);
      expect(result).toEqual([mockAppointment]);
      expect(supabase.from).toHaveBeenCalledWith('appointments');
    });
  });

  describe('delete', () => {
    it('should delete an appointment', async () => {
      await service.delete('1');
      expect(supabase.from).toHaveBeenCalledWith('appointments');
    });
  });

  describe('updateStatus', () => {
    it('should update appointment status', async () => {
      const result = await service.updateStatus('1', 'cancelled', 'Client cancelled', 50);
      expect(result).toEqual(mockAppointment);
      expect(supabase.from).toHaveBeenCalledWith('appointments');
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status', async () => {
      const result = await service.updatePaymentStatus('1', 'paid', 'credit_card');
      expect(result).toEqual(mockAppointment);
      expect(supabase.from).toHaveBeenCalledWith('appointments');
    });
  });

  describe('getStats', () => {
    it('should get appointment stats', async () => {
      const result = await service.getStats('1');
      expect(result).toEqual(mockStats);
      expect(supabase.rpc).toHaveBeenCalledWith('get_appointment_stats', {
        business_id: '1',
      });
    });
  });
}); 