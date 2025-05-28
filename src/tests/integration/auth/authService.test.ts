import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AuthService } from '@/services/auth/authService';
import { BusinessService } from '@/services/business/businessService';
import { ProfessionalService } from '@/services/professional/professionalService';
import { ClientService } from '@/services/client/clientService';
import { supabase } from '@/lib/supabase';
import type { User, UserRole } from '@/types/user';

describe('AuthService Integration', () => {
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

  describe('Authentication Flow', () => {
    it('should handle login and logout correctly', async () => {
      // Login
      const loginResult = await authService.login('test@business.com', 'password123');
      expect(loginResult).toHaveProperty('token');
      expect(loginResult).toHaveProperty('user');
      expect(loginResult.user.role).toBe('admin');

      // Logout
      await authService.logout();
      const session = await authService.getSession();
      expect(session).toBeNull();
    });

    it('should handle invalid credentials', async () => {
      await expect(
        authService.login('test@business.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should handle password reset flow', async () => {
      // Request password reset
      await authService.requestPasswordReset('test@business.com');
      
      // Verify reset token (mock)
      const resetToken = 'mock-reset-token';
      const newPassword = 'newpassword123';
      
      await authService.resetPassword(resetToken, newPassword);
      
      // Try login with new password
      const loginResult = await authService.login('test@business.com', newPassword);
      expect(loginResult).toHaveProperty('token');
    });
  });

  describe('Authorization', () => {
    it('should enforce role-based access control', async () => {
      // Admin access
      const adminSession = await authService.login('test@business.com', 'password123');
      expect(adminSession.user.role).toBe('admin');
      expect(await authService.hasPermission(adminSession.user, 'manage_business')).toBe(true);

      // Professional access
      const professionalSession = await authService.login('test@professional.com', 'password123');
      expect(professionalSession.user.role).toBe('professional');
      expect(await authService.hasPermission(professionalSession.user, 'manage_appointments')).toBe(true);
      expect(await authService.hasPermission(professionalSession.user, 'manage_business')).toBe(false);

      // Client access
      const clientSession = await authService.login('test@client.com', 'password123');
      expect(clientSession.user.role).toBe('client');
      expect(await authService.hasPermission(clientSession.user, 'view_appointments')).toBe(true);
      expect(await authService.hasPermission(clientSession.user, 'manage_appointments')).toBe(false);
    });

    it('should handle token expiration and refresh', async () => {
      // Login
      const session = await authService.login('test@business.com', 'password123');
      
      // Mock token expiration
      jest.advanceTimersByTime(3600000); // 1 hour
      
      // Try to refresh token
      const newSession = await authService.refreshToken(session.refreshToken);
      expect(newSession).toHaveProperty('token');
      expect(newSession.token).not.toBe(session.token);
    });
  });

  describe('Session Management', () => {
    it('should handle multiple sessions correctly', async () => {
      // Create multiple sessions
      const session1 = await authService.login('test@business.com', 'password123');
      const session2 = await authService.login('test@business.com', 'password123');
      
      // Verify both sessions are valid
      expect(await authService.validateSession(session1.token)).toBe(true);
      expect(await authService.validateSession(session2.token)).toBe(true);
      
      // Logout from one session
      await authService.logout(session1.token);
      
      // Verify session states
      expect(await authService.validateSession(session1.token)).toBe(false);
      expect(await authService.validateSession(session2.token)).toBe(true);
    });

    it('should handle session invalidation on password change', async () => {
      // Create session
      const session = await authService.login('test@business.com', 'password123');
      
      // Change password
      await authService.changePassword('password123', 'newpassword123');
      
      // Verify old session is invalid
      expect(await authService.validateSession(session.token)).toBe(false);
      
      // Verify can login with new password
      const newSession = await authService.login('test@business.com', 'newpassword123');
      expect(newSession).toHaveProperty('token');
    });
  });

  afterAll(async () => {
    // Limpa todos os dados de teste
    await clientService.delete(testClientId);
    await professionalService.delete(testProfessionalId);
    await businessService.delete(testBusinessId);
  });
}); 