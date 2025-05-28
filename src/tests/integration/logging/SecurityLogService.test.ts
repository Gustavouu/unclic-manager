import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SecurityLogService } from '@/services/logging/SecurityLogService';

// Testes de integração para o serviço de logs de segurança

describe('SecurityLogService Integration Tests', () => {
  let securityLogService: SecurityLogService;

  beforeAll(() => {
    securityLogService = SecurityLogService.getInstance();
  });

  it('deve registrar tentativas de login', async () => {
    const email = 'test@business.com';
    const success = false;
    const ip = '127.0.0.1';
    await expect(
      securityLogService.logLoginAttempt(email, success, ip)
    ).resolves.not.toThrow();
  });

  it('deve registrar ações críticas', async () => {
    const action = 'change_password';
    const email = 'test@business.com';
    const ip = '127.0.0.1';
    await expect(
      securityLogService.logCriticalAction(action, email, ip)
    ).resolves.not.toThrow();
  });

  it('deve registrar atividades suspeitas', async () => {
    const activity = 'suspicious_login';
    const email = 'test@business.com';
    const ip = '127.0.0.1';
    await expect(
      securityLogService.logSuspiciousActivity(activity, email, ip)
    ).resolves.not.toThrow();
  });
}); 