
import { WebhookConfigService } from "./configService";

/**
 * Service for sending webhook notifications to external services
 */
export const WebhookNotificationService = {
  /**
   * Sends a webhook notification to the configured webhook URL
   */
  async sendWebhookNotification(event: string, payload: any): Promise<boolean> {
    try {
      const config = await WebhookConfigService.getWebhookConfig();
      
      if (!config || !config.isActive || !config.webhookUrl) {
        console.log("Webhook not configured or disabled, skipping notification");
        return false;
      }
      
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': config.secretKey
        },
        body: JSON.stringify({
          event,
          payload,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        console.error(`Error sending webhook notification: ${response.status} ${response.statusText}`);
        return false;
      }
      
      console.log(`Webhook notification sent: ${event}`);
      return true;
    } catch (error) {
      console.error("Error sending webhook notification:", error);
      return false;
    }
  }
};
