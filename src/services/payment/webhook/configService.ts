
import { supabase } from "@/integrations/supabase/client";
import { WebhookConfig } from "./types";

/**
 * Service for managing webhook configurations
 */
export const WebhookConfigService = {
  /**
   * Verifies if a webhook is configured and active
   */
  async isWebhookEnabled(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select('notas')
        .eq('id_negocio', "1")
        .limit(1);
      
      if (error || !data || data.length === 0) {
        return false;
      }
      
      try {
        const notes = data[0].notas ? JSON.parse(data[0].notas) : {};
        return notes.webhook_config?.is_active === true && 
               !!notes.webhook_config?.webhook_url;
      } catch (e) {
        console.error("Erro ao analisar configuração de webhook:", e);
        return false;
      }
    } catch (e) {
      console.error("Erro ao verificar status do webhook:", e);
      return false;
    }
  },
  
  /**
   * Retrieves the current webhook configuration
   */
  async getWebhookConfig(): Promise<WebhookConfig | null> {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select('notas')
        .eq('id_negocio', "1")
        .limit(1);
      
      if (error || !data || data.length === 0) {
        return null;
      }
      
      try {
        const notes = data[0].notas ? JSON.parse(data[0].notas) : {};
        if (!notes.webhook_config) return null;
        
        return {
          webhookUrl: notes.webhook_config.webhook_url || "",
          secretKey: notes.webhook_config.secret_key || "",
          isActive: notes.webhook_config.is_active || false,
          paymentIntegration: notes.webhook_config.payment_integration || "padrao"
        };
      } catch (e) {
        console.error("Erro ao analisar configuração de webhook:", e);
        return null;
      }
    } catch (e) {
      console.error("Erro ao obter configuração de webhook:", e);
      return null;
    }
  }
};
