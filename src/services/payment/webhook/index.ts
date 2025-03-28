
import { WebhookConfigService } from "./configService";
import { WebhookProcessingService } from "./processingService";
import { WebhookNotificationService } from "./notificationService";

/**
 * Export as a single service object for easier access
 */
export const WebhookService = {
  // Configuration methods
  getWebhookConfig: WebhookConfigService.getWebhookConfig,
  saveWebhookConfig: WebhookConfigService.saveWebhookConfig,
  
  // Processing methods
  processWebhook: WebhookProcessingService.processWebhook,
  
  // Notification methods
  sendWebhookNotification: WebhookNotificationService.sendWebhookNotification
};
