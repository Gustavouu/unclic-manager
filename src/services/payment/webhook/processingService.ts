
import { supabase } from "@/integrations/supabase/client";
import { WebhookProcessResult } from "./types";
import { WebhookNotificationService } from "./notificationService";

/**
 * Service for processing incoming webhook notifications
 */
export const WebhookProcessingService = {
  /**
   * Processes a notification received from a payment provider
   */
  async processIncomingWebhook(
    providerName: string,
    payload: any,
    headers: Record<string, string>
  ): Promise<WebhookProcessResult> {
    try {
      console.log(`Recebida notificação de webhook de ${providerName}:`, payload);
      
      if (providerName === 'efi-bank') {
        const paymentId = payload.payment_id;
        const status = payload.status;
        
        if (!paymentId || !status) {
          return { 
            success: false, 
            message: "Payload inválido: faltam campos obrigatórios" 
          };
        }
        
        // Update the transaction status in the payments table
        const { error } = await supabase
          .from('payments')
          .update({ 
            status: status,
            payment_date: status === 'paid' ? new Date().toISOString() : null,
          })
          .eq('id', paymentId);
        
        if (error) {
          console.error("Erro ao atualizar transação:", error);
          return { 
            success: false, 
            message: "Erro ao atualizar transação no banco de dados" 
          };
        }
        
        await WebhookNotificationService.sendWebhookNotification('payment.updated', {
          payment_id: paymentId,
          status,
          updated_at: new Date().toISOString()
        });
        
        return { 
          success: true, 
          message: "Notificação processada com sucesso" 
        };
      }
      
      return { 
        success: false, 
        message: `Provedor de pagamento não suportado: ${providerName}` 
      };
    } catch (error) {
      console.error("Erro ao processar notificação de webhook:", error);
      return { 
        success: false, 
        message: `Erro interno: ${error.message}` 
      };
    }
  }
};
