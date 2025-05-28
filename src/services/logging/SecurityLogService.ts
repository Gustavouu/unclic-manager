import { supabase } from '@/lib/supabase';

export class SecurityLogService {
  private static instance: SecurityLogService;

  private constructor() {}

  public static getInstance(): SecurityLogService {
    if (!SecurityLogService.instance) {
      SecurityLogService.instance = new SecurityLogService();
    }
    return SecurityLogService.instance;
  }

  public async logLoginAttempt(email: string, success: boolean, ip: string): Promise<void> {
    await supabase.from('security_logs').insert({
      action: 'login_attempt',
      email,
      success,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  public async logCriticalAction(action: string, email: string, ip: string): Promise<void> {
    await supabase.from('security_logs').insert({
      action,
      email,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  public async logSuspiciousActivity(activity: string, email: string, ip: string): Promise<void> {
    await supabase.from('security_logs').insert({
      action: 'suspicious_activity',
      details: activity,
      email,
      ip,
      timestamp: new Date().toISOString(),
    });
  }
} 