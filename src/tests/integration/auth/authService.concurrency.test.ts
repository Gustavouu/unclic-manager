import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AuthService } from '@/services/auth/authService';
import { BusinessService } from '@/services/business/businessService';
import { ProfessionalService } from '@/services/professional/professionalService';
import { ClientService } from '@/services/client/clientService';
import { supabase } from '@/lib/supabase';

// Testes de concorrência e performance para autenticação e autorização

describe('AuthService Concurrency & Performance', () => {
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

  it('deve lidar com múltiplos logins simultâneos', async () => {
    const promises = Array(5).fill(null).map(() => 
      authService.login('test@business.com', 'password123')
    );
    const results = await Promise.allSettled(promises);
    const successfulLogins = results.filter(r => r.status === 'fulfilled');
    expect(successfulLogins.length).toBeGreaterThan(0);
  });

  it('deve lidar com expiração de sessão', async () => {
    // Login válido
    const session = await authService.login('test@business.com', 'password123');
    // Simula expiração de sessão (avance o timer)
    jest.advanceTimersByTime(3600000); // 1 hora
    const isValid = await authService.validateSession(session.token);
    expect(isValid).toBe(false);
  });

  it('deve lidar com refresh de token', async () => {
    // Login válido
    const session = await authService.login('test@business.com', 'password123');
    // Simula expiração de sessão
    jest.advanceTimersByTime(3600000); // 1 hora
    // Tenta refresh
    const newSession = await authService.refreshToken(session.refreshToken);
    expect(newSession).toHaveProperty('token');
    expect(newSession.token).not.toBe(session.token);
  });

  afterAll(async () => {
    await clientService.delete(testClientId);
    await professionalService.delete(testProfessionalId);
    await businessService.delete(testBusinessId);
  });
}); 