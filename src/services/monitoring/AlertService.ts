export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  metadata?: Record<string, any>;
}

export class AlertService {
  private static instance: AlertService;
  private alerts: Alert[] = [];
  private subscribers: ((alert: Alert) => void)[] = [];
  private maxAlerts = 100;
  private isProduction = import.meta.env.PROD;

  private constructor() {
    if (!this.isProduction) {
      console.log('🚨 Alert Service initialized');
    }
  }

  public static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  public createAlert(
    type: Alert['type'],
    title: string,
    message: string,
    severity: Alert['severity'] = 'medium',
    metadata?: Record<string, any>
  ): string {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      title,
      message,
      timestamp: new Date(),
      acknowledged: false,
      metadata
    };

    this.alerts.unshift(alert);

    // Keep alerts array manageable
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(0, this.maxAlerts);
    }

    this.notifySubscribers(alert);

    if (!this.isProduction || type === 'error') {
      console.log(`🚨 Alert [${type.toUpperCase()}/${severity.toUpperCase()}]: ${title} - ${message}`, metadata);
    }

    return alert.id;
  }

  public acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.notifySubscribers(alert);
      return true;
    }
    return false;
  }

  public getAlerts(filter?: { type?: Alert['type']; acknowledged?: boolean; limit?: number }): Alert[] {
    let filtered = [...this.alerts];
    
    if (filter?.type) {
      filtered = filtered.filter(a => a.type === filter.type);
    }
    
    if (filter?.acknowledged !== undefined) {
      filtered = filtered.filter(a => a.acknowledged === filter.acknowledged);
    }
    
    if (filter?.limit) {
      filtered = filtered.slice(0, filter.limit);
    }
    
    return filtered;
  }

  public getUnacknowledgedCount(): number {
    return this.alerts.filter(a => !a.acknowledged).length;
  }

  public subscribe(callback: (alert: Alert) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(alert: Alert): void {
    this.subscribers.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in alert subscriber:', error);
      }
    });
  }

  public checkMetric(metricName: string, value: number): void {
    // Simple threshold-based alerting
    const thresholds = {
      error_rate: 0.05, // 5% error rate
      response_time: 2000, // 2 seconds
      memory_usage: 0.9 // 90% memory usage
    };

    const threshold = thresholds[metricName as keyof typeof thresholds];
    if (threshold && value > threshold) {
      this.createAlert(
        'warning',
        `High ${metricName}`,
        `${metricName} is ${value}, which exceeds threshold of ${threshold}`,
        'medium',
        { metricName, value, threshold }
      );
    }
  }

  public clearOldAlerts(olderThanDays: number = 7): void {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);
    
    this.alerts = this.alerts.filter(alert => alert.timestamp >= cutoff);
    this.alerts.forEach(alert => this.notifySubscribers(alert));
  }
}
