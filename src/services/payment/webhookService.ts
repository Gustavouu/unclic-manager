
import { supabase } from "@/integrations/supabase/client";
import { createHmac } from "crypto";

/**
 * Webhook service para processar e enviar eventos de pagamento
 */
export const WebhookService = {
  /**
   * Verifica se um webhook está configurado e ativo
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
   * Obtém a configuração atual do webhook
   */
  async getWebhookConfig(): Promise<{
    webhookUrl: string;
    secretKey: string;
    isActive: boolean;
    paymentIntegration: string;
  } | null> {
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
  },
  
  /**
   * Envia uma notificação para o webhook configurado
   */
  async sendWebhookNotification(event: string, payload: any): Promise<boolean> {
    try {
      const config = await this.getWebhookConfig();
      
      if (!config || !config.isActive || !config.webhookUrl) {
        console.log("Webhook não está configurado ou ativo");
        return false;
      }
      
      // Preparar o corpo da requisição
      const body = JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data: payload
      });
      
      // Calcular a assinatura HMAC usando a chave secreta
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
      
      // Enviar a notificação
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
  },
  
  /**
   * Processa uma notificação recebida de um provedor de pagamento
   */
  async processIncomingWebhook(
    providerName: string,
    payload: any,
    headers: Record<string, string>
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`Recebida notificação de webhook de ${providerName}:`, payload);
      
      // Verificar qual provedor de pagamento está enviando a notificação
      if (providerName === 'efi-bank') {
        // Processar notificação da Efi Bank
        const paymentId = payload.payment_id;
        const status = payload.status;
        
        if (!paymentId || !status) {
          return { 
            success: false, 
            message: "Payload inválido: faltam campos obrigatórios" 
          };
        }
        
        // Atualizar o status da transação no banco de dados
        const { error } = await supabase
          .from('transacoes')
          .update({ 
            status: status,
            data_pagamento: status === 'approved' ? new Date().toISOString() : null,
            notas: JSON.stringify({
              webhook_notification: {
                provider: providerName,
                received_at: new Date().toISOString(),
                payload
              }
            })
          })
          .eq('id', paymentId);
        
        if (error) {
          console.error("Erro ao atualizar transação:", error);
          return { 
            success: false, 
            message: "Erro ao atualizar transação no banco de dados" 
          };
        }
        
        // Enviar notificação para o webhook do cliente
        await this.sendWebhookNotification('payment.updated', {
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
