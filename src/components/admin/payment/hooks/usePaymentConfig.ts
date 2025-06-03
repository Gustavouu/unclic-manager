
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
        // Check if any transaction has payment gateway configuration
        const { data, error } = await supabase
          .from('financial_transactions')
          .select('paymentGatewayData')
          .not('paymentGatewayData', 'is', null)
          .limit(1);

        if (error) {
          console.error("Erro ao verificar configuração de pagamento:", error);
        }

        // Check if any transaction has payment gateway config
        if (data && data.length > 0 && data[0].paymentGatewayData) {
          try {
            const gatewayData = data[0].paymentGatewayData;
            if (typeof gatewayData === 'object' && gatewayData !== null) {
              setState({
                isConfigured: true,
                isWebhookConfigured: true,
                isLoading: false
              });
            } else {
              setState(prev => ({ ...prev, isLoading: false }));
            }
          } catch (parseError) {
            console.error("Error parsing gateway data:", parseError);
            setState(prev => ({ ...prev, isLoading: false }));
          }
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
