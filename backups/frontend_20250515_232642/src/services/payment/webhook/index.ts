
import { WebhookConfigService } from "./configService";
import { WebhookProcessingService } from "./processingService";
import { WebhookNotificationService } from "./notificationService";

/**
 * Export as a single service object for easier access
 */
export const WebhookService = {
  // Configuration methods
  getWebhookConfig: WebhookConfigService.getWebhookConfig,
  isWebhookEnabled: WebhookConfigService.isWebhookEnabled,
  
  // Processing methods
  processIncomingWebhook: WebhookProcessingService.processIncomingWebhook,
  
  // Notification methods
  sendWebhookNotification: WebhookNotificationService.sendWebhookNotification
};
