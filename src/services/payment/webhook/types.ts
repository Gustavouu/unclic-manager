
export interface WebhookProcessResult {
  success: boolean;
  message: string;
}

export interface WebhookConfig {
  webhookUrl: string;
  secretKey: string;
  isActive: boolean;
  paymentIntegration: string;
}

export interface WebhookNotification {
  event: string;
  payload: any;
}
