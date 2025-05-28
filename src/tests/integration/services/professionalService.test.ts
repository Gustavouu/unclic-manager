import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ProfessionalService } from '@/services/professional/professionalService';
import { BusinessService } from '@/services/business/businessService';
import { ServiceService } from '@/services/service/serviceService';
import { supabase } from '@/lib/supabase';
import type { Professional, ProfessionalCreate, ProfessionalUpdate } from '@/types/professional';

describe('ProfessionalService Integration', () => {
  let professionalService: ProfessionalService;
  let businessService: BusinessService;
  let serviceService: ServiceService;
  let testBusinessId: string;
  let testProfessionalId: string;
  let testServiceId: string;

  beforeAll(async () => {
    professionalService = ProfessionalService.getInstance();
    businessService = BusinessService.getInstance();
    serviceService = ServiceService.getInstance();

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
  });

  describe('Professional CRUD', () => {
    it('should create, read, update and delete a professional', async () => {
      // Create
      const professionalData: ProfessionalCreate = {
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
      };

      const createdProfessional = await professionalService.create(professionalData);
      testProfessionalId = createdProfessional.id;

      expect(createdProfessional).toMatchObject(professionalData);

      // Read
      const retrievedProfessional = await professionalService.getById(testProfessionalId);
      expect(retrievedProfessional).toEqual(createdProfessional);

      // Update
      const updatedData: ProfessionalUpdate = {
        name: 'Updated Professional',
        phone: '+5511988888888',
      };

      const updatedProfessional = await professionalService.update(testProfessionalId, updatedData);
      expect(updatedProfessional).toMatchObject({
        ...createdProfessional,
        ...updatedData,
      });

      // Delete
      await professionalService.delete(testProfessionalId);
      await expect(professionalService.getById(testProfessionalId)).rejects.toThrow();
    });
  });

  describe('Professional Search', () => {
    it('should search professionals with various parameters', async () => {
      // Cria alguns profissionais de teste
      const professionals = await Promise.all([
        professionalService.create({
          business_id: testBusinessId,
          user_id: '00000000-0000-0000-0000-000000000000',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+5511999999999',
          specialties: ['Haircut'],
          working_hours: {
            monday: [{ start: '09:00', end: '18:00' }],
            tuesday: [{ start: '09:00', end: '18:00' }],
            wednesday: [{ start: '09:00', end: '18:00' }],
            thursday: [{ start: '09:00', end: '18:00' }],
            friday: [{ start: '09:00', end: '18:00' }],
            saturday: [{ start: '09:00', end: '18:00' }],
            sunday: [],
          },
        }),
        professionalService.create({
          business_id: testBusinessId,
          user_id: '00000000-0000-0000-0000-000000000001',
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '+5511988888888',
          specialties: ['Beard'],
          working_hours: {
            monday: [{ start: '09:00', end: '18:00' }],
            tuesday: [{ start: '09:00', end: '18:00' }],
            wednesday: [{ start: '09:00', end: '18:00' }],
            thursday: [{ start: '09:00', end: '18:00' }],
            friday: [{ start: '09:00', end: '18:00' }],
            saturday: [{ start: '09:00', end: '18:00' }],
            sunday: [],
          },
        }),
      ]);

      // Testa busca por negócio
      const businessResults = await professionalService.search({ business_id: testBusinessId });
      expect(businessResults).toHaveLength(2);

      // Testa busca por especialidade
      const specialtyResults = await professionalService.search({ business_id: testBusinessId, specialty: 'Beard' });
      expect(specialtyResults).toHaveLength(1);

      // Limpa os profissionais de teste
      await Promise.all(professionals.map(p => professionalService.delete(p.id)));
    });
  });

  afterAll(async () => {
    // Limpa todos os dados de teste
    await serviceService.delete(testServiceId);
    await businessService.delete(testBusinessId);
  });
}); 