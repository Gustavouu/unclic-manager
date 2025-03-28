
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
        // Check if any transaction has Efi Bank information in its notes
        const { data, error } = await supabase
          .from('transacoes')
          .select('notas')
          .eq('id_negocio', "1")
          .not('notas', 'is', null)
          .limit(1);

        if (error) {
          console.error("Erro ao verificar configuração da Efi Bank:", error);
        }

        // Check if any transaction has Efi Bank config in notes
        if (data && data.length > 0 && data[0].notas) {
          try {
            const notes = data[0].notas;
            if (typeof notes === 'string') {
              const parsedNotes = JSON.parse(notes);
              setState({
                isConfigured: !!parsedNotes.efi_integration,
                isWebhookConfigured: !!parsedNotes.webhook_config,
                isLoading: false
              });
            }
          } catch (parseError) {
            console.error("Error parsing notes JSON:", parseError);
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
