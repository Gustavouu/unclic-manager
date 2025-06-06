
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PaymentConfigState {
  isConfigured: boolean;
  isWebhookConfigured: boolean;
  isLoading: boolean;
}

export const usePaymentConfig = () => {
  const [state, setState] = useState<PaymentConfigState>({
    isConfigured: false,
    isWebhookConfigured: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        // Check if any payment provider is configured
        const { data, error } = await supabase
          .from('payment_providers')
          .select('configuration, is_active')
          .eq('is_active', true)
          .limit(1);

        if (error) {
          console.error("Erro ao verificar configuração de pagamento:", error);
        }

        // Check if any active payment provider exists
        if (data && data.length > 0) {
          const hasConfig = data.some(provider => 
            provider.configuration && 
            typeof provider.configuration === 'object' && 
            Object.keys(provider.configuration).length > 0
          );
          
          setState({
            isConfigured: hasConfig,
            isWebhookConfigured: hasConfig,
            isLoading: false
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Erro ao verificar configuração:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkConfiguration();
  }, []);

  return state;
};
