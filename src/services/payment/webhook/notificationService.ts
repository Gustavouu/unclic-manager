
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
      
      // Calculate signature using the Web Crypto API instead of Node.js crypto
      let signature = "";
      if (config.secretKey) {
        try {
          // Convert the message and key to ArrayBuffer
          const encoder = new TextEncoder();
          const messageBuffer = encoder.encode(body);
          const keyBuffer = encoder.encode(config.secretKey);
          
          // Import the key
          const cryptoKey = await window.crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
          );
          
          // Sign the message
          const signatureBuffer = await window.crypto.subtle.sign(
            "HMAC",
            cryptoKey,
            messageBuffer
          );
          
          // Convert the signature to hex string
          signature = Array.from(new Uint8Array(signatureBuffer))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
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
