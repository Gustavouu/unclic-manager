import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ServiceService } from '@/services/service/serviceService';
import { BusinessService } from '@/services/business/businessService';
import { ProfessionalService } from '@/services/professional/professionalService';
import { supabase } from '@/lib/supabase';
import type { Service, ServiceCreate, ServiceUpdate, ServiceSearchParams } from '@/types/service';

describe('ServiceService Integration', () => {
  let serviceService: ServiceService;
  let businessService: BusinessService;
  let professionalService: ProfessionalService;
  let testBusinessId: string;
  let testServiceId: string;
  let testProfessionalId: string;

  beforeAll(async () => {
    serviceService = ServiceService.getInstance();
    businessService = BusinessService.getInstance();
    professionalService = ProfessionalService.getInstance();

    // Cria um negócio de teste
    const business = await businessService.create({
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
    testBusinessId = business.id;

    // Cria um profissional de teste
    const professional = await professionalService.create({
      business_id: testBusinessId,
      user_id: '00000000-0000-0000-0000-000000000000',
      name: 'Test Professional',
      email: 'test@professional.com',
      phone: '+5511999999999',
      specialties: ['Haircut', 'Beard'],
      working_hours: {
        monday: [{ start: '09:00', end: '18:00' }],
        tuesday: [{ start: '09:00', end: '18:00' }],
        wednesday: [{ start: '09:00', end: '18:00' }],
        thursday: [{ start: '09:00', end: '18:00' }],
        friday: [{ start: '09:00', end: '18:00' }],
        saturday: [{ start: '09:00', end: '18:00' }],
        sunday: [],
      },
    });
    testProfessionalId = professional.id;
  });

  describe('Service CRUD', () => {
    it('should create, read, update and delete a service', async () => {
      // Create
      const serviceData: ServiceCreate = {
        business_id: testBusinessId,
        name: 'Test Service',
        description: 'Test Description',
        duration: 30,
        price: 50,
        category: 'haircut',
      };

      const createdService = await serviceService.create(serviceData);
      testServiceId = createdService.id;

      expect(createdService).toMatchObject(serviceData);

      // Read
      const retrievedService = await serviceService.getById(testServiceId);
      expect(retrievedService).toEqual(createdService);

      // Update
      const updatedData: ServiceUpdate = {
        name: 'Updated Service',
        price: 60,
      };

      const updatedService = await serviceService.update(testServiceId, updatedData);
      expect(updatedService).toMatchObject({
        ...createdService,
        ...updatedData,
      });

      // Delete
      await serviceService.delete(testServiceId);
      await expect(serviceService.getById(testServiceId)).rejects.toThrow();
    });
  });

  describe('Service Search', () => {
    it('should search services with various parameters', async () => {
      // Cria alguns serviços de teste
      const services = await Promise.all([
        serviceService.create({
          business_id: testBusinessId,
          name: 'Haircut',
          description: 'Haircut Description',
          duration: 30,
          price: 50,
          category: 'haircut',
        }),
        serviceService.create({
          business_id: testBusinessId,
          name: 'Beard Trim',
          description: 'Beard Trim Description',
          duration: 15,
          price: 30,
          category: 'beard',
        }),
      ]);

      // Testa busca por negócio
      const businessResults = await serviceService.search({ business_id: testBusinessId });
      expect(businessResults).toHaveLength(2);

      // Testa busca por categoria
      const categoryResults = await serviceService.search({ business_id: testBusinessId, category: 'beard' });
      expect(categoryResults).toHaveLength(1);

      // Limpa os serviços de teste
      await Promise.all(services.map(s => serviceService.delete(s.id)));
    });
  });

  describe('Service Stats', () => {
    it('should get service statistics', async () => {
      // Cria um serviço de teste
      const testService = await serviceService.create({
        business_id: testBusinessId,
        name: 'Test Service',
        description: 'Test Service Description',
        duration: 30,
        price: 50,
        category: 'haircut',
      });

      // Cria alguns agendamentos de teste
      await Promise.all([
        supabase.from('appointments').insert({
          business_id: testBusinessId,
          professional_id: '00000000-0000-0000-0000-000000000000',
          service_id: testService.id,
          client_id: '00000000-0000-0000-0000-000000000000',
          start_time: '2024-01-01T10:00:00Z',
          end_time: '2024-01-01T10:30:00Z',
          status: 'completed',
          price: 50,
        }),
        supabase.from('appointments').insert({
          business_id: testBusinessId,
          professional_id: '00000000-0000-0000-0000-000000000000',
          service_id: testService.id,
          client_id: '00000000-0000-0000-0000-000000000000',
          start_time: '2024-01-01T11:00:00Z',
          end_time: '2024-01-01T11:30:00Z',
          status: 'completed',
          price: 50,
        }),
      ]);

      // Obtém estatísticas
      const stats = await serviceService.getStats(testService.id);
      expect(stats).toMatchObject({
        totalAppointments: 2,
        completedAppointments: 2,
        cancelledAppointments: 0,
        noShowAppointments: 0,
        totalRevenue: 100,
        averageRating: 0,
        mostPopularDay: null,
        mostPopularTime: null,
      });

      // Limpa os dados de teste
      await serviceService.delete(testService.id);
    });
  });

  afterAll(async () => {
    // Limpa todos os dados de teste
    await professionalService.delete(testProfessionalId);
    await businessService.delete(testBusinessId);
  });
});
