
/**
 * Types for the webhook service
 */
export interface WebhookConfig {
  webhookUrl: string;
  secretKey: string;
  isActive: boolean;
  paymentIntegration: string;
}

export interface WebhookNotificationPayload {
  event: string;
  timestamp: string;
  data: any;
}

export interface WebhookProcessResult {
  success: boolean;
  message: string;
}
