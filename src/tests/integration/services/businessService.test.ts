import { describe, it, expect, beforeAll } from 'vitest';
import { BusinessService } from '@/services/business/businessService';
import { supabase } from '@/lib/supabase';
import type { Business, BusinessCreate, BusinessUpdate } from '@/types/business';

describe('BusinessService Integration', () => {
  let businessService: BusinessService;
  let testBusinessId: string;

  beforeAll(async () => {
    businessService = BusinessService.getInstance();
  });

  describe('Business CRUD', () => {
    it('should create, read, update and delete a business', async () => {
      // Create
      const businessData: BusinessCreate = {
        name: 'Test Business',
        admin_email: 'test@business.com',
        phone: '+5511999999999',
        zip_code: '12345-678',
        address: 'Test Address',
        address_number: '123',
        neighborhood: 'Test Neighborhood',
        city: 'Test City',
        state: 'Test State',
        timezone: 'America/Sao_Paulo',
        settings: {
          allow_remote_queue: true,
          remote_queue_limit: 10,
          require_advance_payment: false,
          minimum_notice_time: 30,
          maximum_days_in_advance: 30,
          allow_simultaneous_appointments: false,
          require_manual_confirmation: false,
          block_no_show_clients: false,
          send_email_confirmation: true,
          send_reminders: true,
          reminder_hours: 24,
          send_followup_message: true,
          followup_hours: 24,
          cancellation_policy_hours: 24,
          no_show_fee: 0,
          primary_color: '#000000',
          secondary_color: '#FFFFFF',
          logo_url: '',
          banner_url: '',
          cancellation_policy: '',
          cancellation_message: '',
        },
      };

      const createdBusiness = await businessService.create(businessData);
      testBusinessId = createdBusiness.id;

      expect(createdBusiness).toMatchObject(businessData);

      // Read
      const retrievedBusiness = await businessService.getById(testBusinessId);
      expect(retrievedBusiness).toEqual(createdBusiness);

      // Update
      const updatedData: BusinessUpdate = {
        name: 'Updated Business',
        phone: '+5511988888888',
      };

      const updatedBusiness = await businessService.update(testBusinessId, updatedData);
      expect(updatedBusiness).toMatchObject({
        ...createdBusiness,
        ...updatedData,
      });

      // Delete
      await businessService.delete(testBusinessId);
      await expect(businessService.getById(testBusinessId)).rejects.toThrow();
    });
  });

  describe('Business Stats', () => {
    it('should get business statistics', async () => {
      // Cria um negócio de teste
      const testBusiness = await businessService.create({
        name: 'Test Business',
        admin_email: 'test@business.com',
        phone: '+5511999999999',
        zip_code: '12345-678',
        address: 'Test Address',
        address_number: '123',
        neighborhood: 'Test Neighborhood',
        city: 'Test City',
        state: 'Test State',
        timezone: 'America/Sao_Paulo',
        settings: {
          allow_remote_queue: true,
          remote_queue_limit: 10,
          require_advance_payment: false,
          minimum_notice_time: 30,
          maximum_days_in_advance: 30,
          allow_simultaneous_appointments: false,
          require_manual_confirmation: false,
          block_no_show_clients: false,
          send_email_confirmation: true,
          send_reminders: true,
          reminder_hours: 24,
          send_followup_message: true,
          followup_hours: 24,
          cancellation_policy_hours: 24,
          no_show_fee: 0,
          primary_color: '#000000',
          secondary_color: '#FFFFFF',
          logo_url: '',
          banner_url: '',
          cancellation_policy: '',
          cancellation_message: '',
        },
      });

      // Cria alguns agendamentos de teste
      await Promise.all([
        supabase.from('appointments').insert({
          business_id: testBusiness.id,
          professional_id: '00000000-0000-0000-0000-000000000000',
          service_id: '00000000-0000-0000-0000-000000000000',
          client_id: '00000000-0000-0000-0000-000000000000',
          start_time: '2024-01-01T10:00:00Z',
          end_time: '2024-01-01T10:30:00Z',
          status: 'completed',
          price: 50,
        }),
        supabase.from('appointments').insert({
          business_id: testBusiness.id,
          professional_id: '00000000-0000-0000-0000-000000000000',
          service_id: '00000000-0000-0000-0000-000000000000',
          client_id: '00000000-0000-0000-0000-000000000000',
          start_time: '2024-01-01T11:00:00Z',
          end_time: '2024-01-01T11:30:00Z',
          status: 'cancelled',
          price: 50,
        }),
      ]);

      // Obtém estatísticas
      const stats = await businessService.getStats(testBusiness.id);
      expect(stats).toMatchObject({
        totalAppointments: 2,
        completedAppointments: 1,
        cancelledAppointments: 1,
        noShowAppointments: 0,
        totalRevenue: 50,
        averageRating: 0,
        mostPopularDay: null,
        mostPopularTime: null,
        totalClients: 0,
        totalProfessionals: 0,
        totalServices: 0,
      });

      // Limpa os dados de teste
      await businessService.delete(testBusiness.id);
    });
  });
}); 