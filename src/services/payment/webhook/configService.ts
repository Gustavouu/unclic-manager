
import { supabase } from "@/integrations/supabase/client";
import { WebhookConfig } from "./types";

/**
 * Service for webhook configuration
 */
export const WebhookConfigService = {
  /**
   * Gets the current webhook configuration
   */
  async getWebhookConfig(): Promise<WebhookConfig | null> {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('notes')
        .eq('tenantId', "1")
        .limit(1);

      if (error) {
        console.error("Error fetching webhook config:", error);
        return null;
      }

      if (data && data.length > 0 && data[0].notes) {
        try {
          const notes = JSON.parse(data[0].notes);
          if (notes.webhook_config) {
            return {
              webhookUrl: notes.webhook_config.webhook_url || "",
              secretKey: notes.webhook_config.secret_key || "",
              isActive: notes.webhook_config.is_active || false,
              paymentIntegration: notes.webhook_config.payment_integration || "padrao"
            };
          }
        } catch (parseError) {
          console.error("Error parsing webhook config:", parseError);
        }
      }

      return null;
    } catch (err) {
      console.error("Error loading webhook config:", err);
      return null;
    }
  },

  /**
   * Checks if webhook is enabled
   */
  async isWebhookEnabled(): Promise<boolean> {
    const config = await this.getWebhookConfig();
    return config?.isActive || false;
  }
};
