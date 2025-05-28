import { SecurityLogService } from '@/services/logging/SecurityLogService';
import { supabase } from '@/lib/supabase';

export class SecurityMonitoringService {
  private static instance: SecurityMonitoringService;
  private securityLogService: SecurityLogService;
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutos em milissegundos

  private constructor() {
    this.securityLogService = SecurityLogService.getInstance();
  }

  public static getInstance(): SecurityMonitoringService {
    if (!SecurityMonitoringService.instance) {
      SecurityMonitoringService.instance = new SecurityMonitoringService();
    }
    return SecurityMonitoringService.instance;
  }

  public async monitorLoginAttempts(email: string, ip: string): Promise<void> {
    // Registra a tentativa de login
    await this.securityLogService.logLoginAttempt(email, false, ip);

    // Obtém tentativas recentes de login
    const recentAttempts = await this.getRecentLoginAttempts(email, ip);
    
    if (recentAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      await this.sendAlert(`Múltiplas tentativas de login falhas para ${email} de ${ip}`);
      await this.blockIP(ip);
    }
  }

  public async monitorCriticalActions(action: string, email: string, ip: string): Promise<void> {
    await this.securityLogService.logCriticalAction(action, email, ip);
    await this.sendAlert(`Ação crítica: ${action} por ${email} de ${ip}`);
  }

  public async monitorSuspiciousActivity(activity: string, email: string, ip: string): Promise<void> {
    await this.securityLogService.logSuspiciousActivity(activity, email, ip);
    await this.sendAlert(`Atividade suspeita: ${activity} por ${email} de ${ip}`);
  }

  private async getRecentLoginAttempts(email: string, ip: string): Promise<number> {
    const { data, error } = await supabase
      .from('security_logs')
      .select('*')
      .eq('action', 'login_attempt')
      .eq('email', email)
      .eq('ip', ip)
      .eq('success', false)
      .gte('timestamp', new Date(Date.now() - this.LOGIN_ATTEMPT_WINDOW).toISOString());

    if (error) {
      console.error('Erro ao obter tentativas de login:', error);
      return 0;
    }

    return data?.length || 0;
  }

  private async blockIP(ip: string): Promise<void> {
    const { error } = await supabase
      .from('blocked_ips')
      .insert({
        ip,
        blocked_at: new Date().toISOString(),
        reason: 'Múltiplas tentativas de login falhas',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      });

    if (error) {
      console.error('Erro ao bloquear IP:', error);
    }
  }

  private async sendAlert(message: string): Promise<void> {
    // Implementação de envio de alerta (ex: e-mail, SMS, etc.)
    console.log(`ALERTA: ${message}`);
    
    // Registra o alerta no banco de dados
    const { error } = await supabase
      .from('security_alerts')
      .insert({
        message,
        created_at: new Date().toISOString(),
        status: 'pending',
      });

    if (error) {
      console.error('Erro ao registrar alerta:', error);
    }
  }
} 