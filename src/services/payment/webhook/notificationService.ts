
import { createHmac } from "crypto";
import { WebhookConfigService } from "./configService";
import { WebhookNotificationPayload } from "./types";

/**
 * Service for sending webhook notifications
 */
export const WebhookNotificationService = {
  /**
   * Sends a notification to the configured webhook
   */
  async sendWebhookNotification(event: string, payload: any): Promise<boolean> {
    try {
      const config = await WebhookConfigService.getWebhookConfig();
      
      if (!config || !config.isActive || !config.webhookUrl) {
        console.log("Webhook não está configurado ou ativo");
        return false;
      }
      
      // Prepare request body
      const notificationPayload: WebhookNotificationPayload = {
        event,
        timestamp: new Date().toISOString(),
        data: payload
      };
      
      const body = JSON.stringify(notificationPayload);
      
      // Calculate HMAC signature using the secret key
      let signature = "";
      if (config.secretKey) {
        try {
          const hmac = createHmac('sha256', config.secretKey);
          hmac.update(body);
          signature = hmac.digest('hex');
        } catch (error) {
          console.error("Erro ao gerar assinatura HMAC:", error);
        }
      }
      
      // Send the notification
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': event
        },
        body
      });
      
      if (!response.ok) {
        console.error("Erro ao enviar notificação de webhook:", await response.text());
        return false;
      }
      
      console.log(`Notificação de webhook enviada com sucesso: ${event}`);
      return true;
    } catch (error) {
      console.error("Erro ao enviar notificação de webhook:", error);
      return false;
    }
  }
};
