import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AuthService } from '@/services/auth/authService';
import { BusinessService } from '@/services/business/businessService';
import { ProfessionalService } from '@/services/professional/professionalService';
import { ClientService } from '@/services/client/clientService';
import { supabase } from '@/lib/supabase';

// Testes de fluxos de erro e casos de borda para autenticação e autorização

describe('AuthService Error & Edge Cases', () => {
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

  it('deve retornar erro ao tentar login com e-mail inexistente', async () => {
    await expect(
      authService.login('naoexiste@teste.com', 'qualquercoisa')
    ).rejects.toThrow('Invalid credentials');
  });

  it('deve retornar erro ao tentar login com senha errada', async () => {
    await expect(
      authService.login('test@business.com', 'senhaerrada')
    ).rejects.toThrow('Invalid credentials');
  });

  it('deve bloquear redefinição de senha para e-mail inexistente', async () => {
    await expect(
      authService.requestPasswordReset('naoexiste@teste.com')
    ).rejects.toThrow();
  });

  it('deve retornar erro ao redefinir senha com token inválido', async () => {
    await expect(
      authService.resetPassword('token-invalido', 'novasenha123')
    ).rejects.toThrow();
  });

  it('deve retornar erro ao alterar senha para uma senha fraca', async () => {
    // Login válido
    await authService.login('test@business.com', 'password123');
    await expect(
      authService.changePassword('password123', '123')
    ).rejects.toThrow();
  });

  it('deve negar acesso a permissão não permitida', async () => {
    const clientSession = await authService.login('test@client.com', 'password123');
    const has = await authService.hasPermission(clientSession.user, 'manage_business');
    expect(has).toBe(false);
  });

  it('deve negar acesso a endpoints sem autenticação', async () => {
    // Simula sessão inválida
    const isValid = await authService.validateSession('token-invalido');
    expect(isValid).toBe(false);
  });

  afterAll(async () => {
    await clientService.delete(testClientId);
    await professionalService.delete(testProfessionalId);
    await businessService.delete(testBusinessId);
  });
}); 