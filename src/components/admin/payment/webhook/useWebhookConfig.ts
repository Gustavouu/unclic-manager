
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BusinessSettings } from "@/types/database";

export interface WebhookConfig {
  webhookUrl: string;
  secretKey: string;
  isActive: boolean;
  paymentIntegration: string;
}

// Temporary business ID for demo purposes
const TEMP_BUSINESS_ID = "00000000-0000-0000-0000-000000000000";

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
        const { data: settings, error } = await supabase
          .from('business_settings')
          .select('*')
          .eq('business_id', TEMP_BUSINESS_ID)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar configuração de webhook:", error);
          return;
        }

        // Check if settings exist
        if (settings) {
          try {
            // Parse the notes field if it exists
            let notesObj = null;
            
            if (settings.notes) {
              // Handle notes as string or object
              notesObj = typeof settings.notes === 'string' 
                ? JSON.parse(settings.notes) 
                : settings.notes;
            }
              
            // If we have webhook configuration in notes
            if (notesObj && notesObj.webhook_config) {
              setConfig({
                webhookUrl: notesObj.webhook_config.webhook_url || "",
                secretKey: notesObj.webhook_config.secret_key || "",
                isActive: notesObj.webhook_config.is_active || false,
                paymentIntegration: notesObj.webhook_config.payment_integration || "padrao"
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
    // Generate a random 32 character secret key
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
      // Create configuration object to store
      const webhookConfigData = {
        webhook_config: {
          webhook_url: config.webhookUrl,
          secret_key: config.secretKey,
          is_active: config.isActive,
          payment_integration: config.paymentIntegration,
          updated_at: new Date().toISOString()
        }
      };

      // Convert to JSON string
      const notesValue = JSON.stringify(webhookConfigData);

      const { error } = await supabase
        .from('business_settings')
        .upsert({
          business_id: TEMP_BUSINESS_ID,
          primary_color: '#213858', // Default value required by the schema
          secondary_color: '#33c3f0', // Default value required by the schema
          notes: notesValue
        }, {
          onConflict: 'business_id'
        });

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
