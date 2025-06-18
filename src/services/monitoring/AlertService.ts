
interface Alert {
  id: string;
  type: 'performance' | 'error' | 'security' | 'business';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: number;
  acknowledged: boolean;
  metadata?: Record<string, any>;
}

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'greater' | 'less' | 'equal';
  threshold: number;
  duration: number; // ms
  severity: Alert['severity'];
  enabled: boolean;
}

export class AlertService {
  private static instance: AlertService;
  private alerts: Alert[] = [];
  private rules: AlertRule[] = [];
  private subscribers: Array<(alert: Alert) => void> = [];

  private constructor() {
    this.initializeDefaultRules();
  }

  public static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'high-response-time',
        name: 'Alto tempo de resposta',
        metric: 'response_time',
        condition: 'greater',
        threshold: 2000,
        duration: 30000,
        severity: 'high',
        enabled: true
      },
      {
        id: 'high-error-rate',
        name: 'Alta taxa de erro',
        metric: 'error_rate',
        condition: 'greater',
        threshold: 5,
        duration: 60000,
        severity: 'critical',
        enabled: true
      },
      {
        id: 'low-cache-hit-rate',
        name: 'Baixa taxa de cache hit',
        metric: 'cache_hit_rate',
        condition: 'less',
        threshold: 70,
        duration: 300000,
        severity: 'medium',
        enabled: true
      },
      {
        id: 'high-memory-usage',
        name: 'Alto uso de memória',
        metric: 'memory_usage',
        condition: 'greater',
        threshold: 85,
        duration: 120000,
        severity: 'high',
        enabled: true
      },
      {
        id: 'slow-database-queries',
        name: 'Queries de banco lentas',
        metric: 'db_query_time',
        condition: 'greater',
        threshold: 1000,
        duration: 30000,
        severity: 'medium',
        enabled: true
      }
    ];
  }

  public checkMetric(metric: string, value: number): void {
    const applicableRules = this.rules.filter(rule => 
      rule.enabled && rule.metric === metric
    );

    for (const rule of applicableRules) {
      const shouldAlert = this.evaluateCondition(value, rule.condition, rule.threshold);
      
      if (shouldAlert) {
        // Verificar se já existe um alerta similar recente
        const recentAlert = this.alerts.find(alert => 
          alert.metadata?.ruleId === rule.id &&
          !alert.acknowledged &&
          (Date.now() - alert.timestamp) < rule.duration
        );

        if (!recentAlert) {
          this.createAlert(rule, value);
        }
      }
    }
  }

  private evaluateCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case 'greater':
        return value > threshold;
      case 'less':
        return value < threshold;
      case 'equal':
        return value === threshold;
      default:
        return false;
    }
  }

  private createAlert(rule: AlertRule, value: number): void {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: this.getAlertType(rule.metric),
      severity: rule.severity,
      title: rule.name,
      message: this.generateAlertMessage(rule, value),
      timestamp: Date.now(),
      acknowledged: false,
      metadata: {
        ruleId: rule.id,
        metric: rule.metric,
        value,
        threshold: rule.threshold
      }
    };

    this.alerts.unshift(alert);
    
    // Manter apenas os últimos 100 alertas
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100);
    }

    // Notificar subscribers
    this.notifySubscribers(alert);

    console.warn(`Alert triggered: ${alert.title}`, alert);
  }

  private getAlertType(metric: string): Alert['type'] {
    if (metric.includes('error') || metric.includes('fail')) {
      return 'error';
    }
    if (metric.includes('security') || metric.includes('auth')) {
      return 'security';
    }
    if (metric.includes('revenue') || metric.includes('business')) {
      return 'business';
    }
    return 'performance';
  }

  private generateAlertMessage(rule: AlertRule, value: number): string {
    const formatValue = (val: number) => {
      if (rule.metric.includes('time')) {
        return `${val.toFixed(0)}ms`;
      }
      if (rule.metric.includes('rate') || rule.metric.includes('percent')) {
        return `${val.toFixed(1)}%`;
      }
      return val.toString();
    };

    return `${rule.metric} atingiu ${formatValue(value)}, acima do limite de ${formatValue(rule.threshold)}`;
  }

  private notifySubscribers(alert: Alert): void {
    this.subscribers.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error notifying alert subscriber:', error);
      }
    });
  }

  public subscribe(callback: (alert: Alert) => void): () => void {
    this.subscribers.push(callback);
    
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  public getAlerts(options?: {
    severity?: Alert['severity'][];
    type?: Alert['type'][];
    acknowledged?: boolean;
    limit?: number;
  }): Alert[] {
    let filtered = [...this.alerts];

    if (options?.severity) {
      filtered = filtered.filter(alert => options.severity!.includes(alert.severity));
    }

    if (options?.type) {
      filtered = filtered.filter(alert => options.type!.includes(alert.type));
    }

    if (options?.acknowledged !== undefined) {
      filtered = filtered.filter(alert => alert.acknowledged === options.acknowledged);
    }

    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  public acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  public acknowledgeAllAlerts(): void {
    this.alerts.forEach(alert => {
      alert.acknowledged = true;
    });
  }

  public getUnacknowledgedCount(): number {
    return this.alerts.filter(alert => !alert.acknowledged).length;
  }

  public getSummary(): {
    total: number;
    unacknowledged: number;
    bySeverity: Record<Alert['severity'], number>;
    byType: Record<Alert['type'], number>;
  } {
    const bySeverity = { low: 0, medium: 0, high: 0, critical: 0 };
    const byType = { performance: 0, error: 0, security: 0, business: 0 };

    this.alerts.forEach(alert => {
      bySeverity[alert.severity]++;
      byType[alert.type]++;
    });

    return {
      total: this.alerts.length,
      unacknowledged: this.getUnacknowledgedCount(),
      bySeverity,
      byType
    };
  }

  public updateRule(ruleId: string, updates: Partial<AlertRule>): boolean {
    const ruleIndex = this.rules.findIndex(rule => rule.id === ruleId);
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
      return true;
    }
    return false;
  }

  public getRules(): AlertRule[] {
    return [...this.rules];
  }
}
