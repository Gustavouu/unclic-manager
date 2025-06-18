
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BusinessHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface BusinessConfig {
  businessHours: BusinessHours;
  bufferTime: number;
  minAdvanceTime: number;
  maxFutureDays: number;
  requireConfirmation: boolean;
}

const defaultConfig: BusinessConfig = {
  businessHours: {
    segunda: { enabled: true, start: "09:00", end: "18:00" },
    terca: { enabled: true, start: "09:00", end: "18:00" },
    quarta: { enabled: true, start: "09:00", end: "18:00" },
    quinta: { enabled: true, start: "09:00", end: "18:00" },
    sexta: { enabled: true, start: "09:00", end: "18:00" },
    sabado: { enabled: true, start: "09:00", end: "13:00" },
    domingo: { enabled: false, start: "00:00", end: "00:00" },
  },
  bufferTime: 15, // minutos entre agendamentos
  minAdvanceTime: 30, // minutos de antecedência mínima
  maxFutureDays: 30, // dias máximos para agendamento futuro
  requireConfirmation: true, // requer confirmação do agendamento
};

export const useBusinessConfig = () => {
  const [config, setConfig] = useState<BusinessConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data: businessConfig, error } = await supabase
          .from("business_settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar configurações:", error);
          return;
        }

        if (businessConfig) {
          // Convert business settings to config format
          setConfig({
            businessHours: defaultConfig.businessHours, // Use default for now
            bufferTime: businessConfig.minimum_notice_time || defaultConfig.bufferTime,
            minAdvanceTime: businessConfig.minimum_notice_time || defaultConfig.minAdvanceTime,
            maxFutureDays: businessConfig.maximum_days_in_advance || defaultConfig.maxFutureDays,
            requireConfirmation: businessConfig.require_advance_payment ?? defaultConfig.requireConfirmation,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar configurações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return {
    ...config,
    loading,
  };
}; 
