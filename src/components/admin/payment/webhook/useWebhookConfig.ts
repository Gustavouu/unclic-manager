
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WebhookConfig {
  webhookUrl: string;
  secretKey: string;
  isActive: boolean;
  paymentIntegration: string;
}

export const useWebhookConfig = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<WebhookConfig>({
    webhookUrl: "",
    secretKey: "",
    isActive: false,
    paymentIntegration: "padrao"
  });

  // Load existing configuration if available
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('transacoes')
          .select('notas')
          .eq('id_negocio', "1")
          .limit(1);

        if (error) {
          console.error("Erro ao buscar configuração de webhook:", error);
          return;
        }

        if (data && data.length > 0 && data[0].notas) {
          try {
            const notes = JSON.parse(data[0].notas);
            if (notes.webhook_config) {
              setConfig({
                webhookUrl: notes.webhook_config.webhook_url || "",
                secretKey: notes.webhook_config.secret_key || "",
                isActive: notes.webhook_config.is_active || false,
                paymentIntegration: notes.webhook_config.payment_integration || "padrao"
              });
            }
          } catch (parseError) {
            console.error("Erro ao analisar configuração de webhook:", parseError);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar configuração de webhook:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (field: keyof WebhookConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSecretKey = () => {
    // Gera uma chave aleatória de 32 caracteres
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    handleChange("secretKey", result);
    toast.success("Chave secreta gerada com sucesso!");
  };

  const saveWebhookConfig = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('transacoes')
        .update({ 
          notas: JSON.stringify({
            webhook_config: {
              webhook_url: config.webhookUrl,
              secret_key: config.secretKey,
              is_active: config.isActive,
              payment_integration: config.paymentIntegration,
              updated_at: new Date().toISOString()
            }
          })
        })
        .eq('id_negocio', "1")
        .limit(1);

      if (error) throw error;

      toast.success("Configurações de webhook salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações de webhook:", error);
      toast.error("Erro ao salvar configurações. Verifique os logs para mais detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    isLoading,
    handleChange,
    generateSecretKey,
    saveWebhookConfig
  };
};
