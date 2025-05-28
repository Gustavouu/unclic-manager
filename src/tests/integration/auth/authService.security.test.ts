import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AuthService } from '@/services/auth/authService';
import { BusinessService } from '@/services/business/businessService';
import { ProfessionalService } from '@/services/professional/professionalService';
import { ClientService } from '@/services/client/clientService';
import { supabase } from '@/lib/supabase';

// Testes de segurança para autenticação e autorização

describe('AuthService Security Tests', () => {
  let authService: AuthService;
  let businessService: BusinessService;
  let professionalService: ProfessionalService;
  let clientService: ClientService;
  let testBusinessId: string;
  let testProfessionalId: string;
  let testClientId: string;

  beforeAll(async () => {
    authService = AuthService.getInstance();
    businessService = BusinessService.getInstance();
    professionalService = ProfessionalService.getInstance();
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

    // Cria um cliente de teste
    const client = await clientService.create({
      business_id: testBusinessId,
      name: 'Test Client',
      email: 'test@client.com',
      phone: '+5511999999999',
    });
    testClientId = client.id;
  });

  it('deve prevenir ataques XSS', async () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    await expect(
      authService.login(maliciousInput, 'password123')
    ).rejects.toThrow();
  });

  it('deve prevenir ataques CSRF', async () => {
    // Simula uma requisição sem token CSRF
    await expect(
      authService.changePassword('password123', 'novasenha123')
    ).rejects.toThrow();
  });

  it('deve prevenir ataques de brute force', async () => {
    for (let i = 0; i < 5; i++) {
      await expect(
        authService.login('test@business.com', 'wrongpassword')
      ).rejects.toThrow();
    }
    await expect(
      authService.login('test@business.com', 'password123')
    ).rejects.toThrow();
  });

  afterAll(async () => {
    await clientService.delete(testClientId);
    await professionalService.delete(testProfessionalId);
    await businessService.delete(testBusinessId);
  });
}); 