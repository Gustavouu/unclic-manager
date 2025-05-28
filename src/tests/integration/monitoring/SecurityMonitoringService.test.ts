import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SecurityMonitoringService } from '@/services/monitoring/SecurityMonitoringService';
import { SecurityLogService } from '@/services/logging/SecurityLogService';

// Testes de integração para o serviço de monitoramento de segurança

describe('SecurityMonitoringService Integration Tests', () => {
  let securityMonitoringService: SecurityMonitoringService;
  let securityLogService: SecurityLogService;

  beforeAll(() => {
    securityMonitoringService = SecurityMonitoringService.getInstance();
    securityLogService = SecurityLogService.getInstance();
  });

  it('deve detectar múltiplas tentativas de login falhas', async () => {
    const email = 'test@business.com';
    const ip = '127.0.0.1';
    for (let i = 0; i < 6; i++) {
      await securityMonitoringService.monitorLoginAttempts(email, ip);
    }
    // Verificar se o alerta foi enviado (ex: verificar logs)
  });

  it('deve monitorar ações críticas', async () => {
    const action = 'change_password';
    const email = 'test@business.com';
    const ip = '127.0.0.1';
    await securityMonitoringService.monitorCriticalActions(action, email, ip);
    // Verificar se o alerta foi enviado (ex: verificar logs)
  });

  it('deve monitorar atividades suspeitas', async () => {
    const activity = 'suspicious_login';
    const email = 'test@business.com';
    const ip = '127.0.0.1';
    await securityMonitoringService.monitorSuspiciousActivity(activity, email, ip);
    // Verificar se o alerta foi enviado (ex: verificar logs)
  });
}); 