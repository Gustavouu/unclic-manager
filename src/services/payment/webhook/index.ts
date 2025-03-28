
import { WebhookConfigService } from "./configService";
import { WebhookNotificationService } from "./notificationService";
import { WebhookProcessingService } from "./processingService";
import type { WebhookConfig, WebhookProcessResult } from "./types";

/**
 * Main Webhook service that exposes functionality for the application
 */
export const WebhookService = {
  /**
   * Checks if a webhook is configured and active
   */
  isWebhookEnabled: WebhookConfigService.isWebhookEnabled,
  
  /**
   * Gets the current webhook configuration
   */
  getWebhookConfig: WebhookConfigService.getWebhookConfig,
  
  /**
   * Sends a notification to the configured webhook
   */
  sendWebhookNotification: WebhookNotificationService.sendWebhookNotification,
  
  /**
   * Processes a notification received from a payment provider
   */
  processIncomingWebhook: WebhookProcessingService.processIncomingWebhook
};

// Export types
export type { WebhookConfig, WebhookProcessResult };
