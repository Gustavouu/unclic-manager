import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AppointmentService } from '@/services/appointment/appointmentService';
import { BusinessService } from '@/services/business/businessService';
import { ProfessionalService } from '@/services/professional/professionalService';
import { ServiceService } from '@/services/service/serviceService';
import { ClientService } from '@/services/client/clientService';
import { supabase } from '@/lib/supabase';
import type { Appointment, AppointmentCreate, AppointmentUpdate } from '@/types/appointment';

describe('AppointmentService Integration', () => {
  let appointmentService: AppointmentService;
  let businessService: BusinessService;
  let professionalService: ProfessionalService;
  let serviceService: ServiceService;
  let clientService: ClientService;
  let testBusinessId: string;
  let testProfessionalId: string;
  let testServiceId: string;
  let testClientId: string;
  let testAppointmentId: string;

  beforeAll(async () => {
    appointmentService = AppointmentService.getInstance();
    businessService = BusinessService.getInstance();
    professionalService = ProfessionalService.getInstance();
    serviceService = ServiceService.getInstance();
    clientService = ClientService.getInstance();

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

    // Cria um serviço de teste
    const service = await serviceService.create({
      business_id: testBusinessId,
      name: 'Test Service',
      description: 'Test Description',
      duration: 30,
      price: 50,
      category: 'haircut',
    });
    testServiceId = service.id;

    // Cria um cliente de teste
    const client = await clientService.create({
      business_id: testBusinessId,
      name: 'Test Client',
      email: 'test@client.com',
      phone: '+5511999999999',
    });
    testClientId = client.id;
  });

  describe('Appointment CRUD', () => {
    it('should create, read, update and delete an appointment', async () => {
      // Create
      const appointmentData: AppointmentCreate = {
        business_id: testBusinessId,
        professional_id: testProfessionalId,
        service_id: testServiceId,
        client_id: testClientId,
        start_time: '2024-01-01T10:00:00Z',
        end_time: '2024-01-01T10:30:00Z',
        status: 'scheduled',
        price: 50,
      };

      const createdAppointment = await appointmentService.create(appointmentData);
      testAppointmentId = createdAppointment.id;

      expect(createdAppointment).toMatchObject(appointmentData);

      // Read
      const retrievedAppointment = await appointmentService.getById(testAppointmentId);
      expect(retrievedAppointment).toEqual(createdAppointment);

      // Update
      const updatedData: AppointmentUpdate = {
        status: 'completed',
        price: 60,
      };

      const updatedAppointment = await appointmentService.update(testAppointmentId, updatedData);
      expect(updatedAppointment).toMatchObject({
        ...createdAppointment,
        ...updatedData,
      });

      // Delete
      await appointmentService.delete(testAppointmentId);
      await expect(appointmentService.getById(testAppointmentId)).rejects.toThrow();
    });
  });

  describe('Appointment Search', () => {
    it('should search appointments with various parameters', async () => {
      // Cria alguns agendamentos de teste
      const appointments = await Promise.all([
        appointmentService.create({
          business_id: testBusinessId,
          professional_id: testProfessionalId,
          service_id: testServiceId,
          client_id: testClientId,
          start_time: '2024-01-01T10:00:00Z',
          end_time: '2024-01-01T10:30:00Z',
          status: 'scheduled',
          price: 50,
        }),
        appointmentService.create({
          business_id: testBusinessId,
          professional_id: testProfessionalId,
          service_id: testServiceId,
          client_id: testClientId,
          start_time: '2024-01-01T11:00:00Z',
          end_time: '2024-01-01T11:30:00Z',
          status: 'completed',
          price: 50,
        }),
      ]);

      // Testa busca por negócio
      const businessResults = await appointmentService.search({
        business_id: testBusinessId,
      });
      expect(businessResults).toHaveLength(2);

      // Testa busca por profissional
      const professionalResults = await appointmentService.search({
        business_id: testBusinessId,
        professional_id: testProfessionalId,
      });
      expect(professionalResults).toHaveLength(2);

      // Testa busca por cliente
      const clientResults = await appointmentService.search({
        business_id: testBusinessId,
        client_id: testClientId,
      });
      expect(clientResults).toHaveLength(2);

      // Testa busca por status
      const statusResults = await appointmentService.search({
        business_id: testBusinessId,
        status: 'completed',
      });
      expect(statusResults).toHaveLength(1);

      // Testa busca por data
      const dateResults = await appointmentService.search({
        business_id: testBusinessId,
        start_date: '2024-01-01',
        end_date: '2024-01-01',
      });
      expect(dateResults).toHaveLength(2);

      // Limpa os agendamentos de teste
      await Promise.all(appointments.map(a => appointmentService.delete(a.id)));
    });
  });

  describe('Appointment Stats', () => {
    it('should get appointment statistics', async () => {
      // Cria alguns agendamentos de teste
      const appointments = await Promise.all([
        appointmentService.create({
          business_id: testBusinessId,
          professional_id: testProfessionalId,
          service_id: testServiceId,
          client_id: testClientId,
          start_time: '2024-01-01T10:00:00Z',
          end_time: '2024-01-01T10:30:00Z',
          status: 'completed',
          price: 50,
        }),
        appointmentService.create({
          business_id: testBusinessId,
          professional_id: testProfessionalId,
          service_id: testServiceId,
          client_id: testClientId,
          start_time: '2024-01-01T11:00:00Z',
          end_time: '2024-01-01T11:30:00Z',
          status: 'cancelled',
          price: 50,
        }),
      ]);

      // Obtém estatísticas
      const stats = await appointmentService.getStats(testBusinessId);
      expect(stats).toMatchObject({
        totalAppointments: 2,
        completedAppointments: 1,
        cancelledAppointments: 1,
        noShowAppointments: 0,
        totalRevenue: 50,
        averageRating: 0,
        mostPopularDay: null,
        mostPopularTime: null,
      });

      // Limpa os agendamentos de teste
      await Promise.all(appointments.map(a => appointmentService.delete(a.id)));
    });
  });

  afterAll(async () => {
    // Limpa todos os dados de teste
    await clientService.delete(testClientId);
    await serviceService.delete(testServiceId);
    await professionalService.delete(testProfessionalId);
    await businessService.delete(testBusinessId);
  });
}); 