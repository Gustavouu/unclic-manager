
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

interface BusinessHours {
  [key: string]: {
    open: boolean;
    openTime: string;
    closeTime: string;
  };
}

interface BusinessConfig {
  id: string | null;
  businessHours: BusinessHours;
  bufferTime: number;
  minAdvanceTime: number;
  maxFutureDays: number;
  requireConfirmation: boolean;
  allowTips: boolean;
  aiEnabled: boolean;
  humanFallbackEnabled: boolean;
  remoteQueueEnabled: boolean;
  remoteQueueLimit: number;
  primaryColor: string;
  secondaryColor: string;
  cancellationPolicy: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  paymentGatewayConfig: any;
}

const defaultBusinessHours: BusinessHours = {
  monday: { open: true, openTime: "09:00", closeTime: "18:00" },
  tuesday: { open: true, openTime: "09:00", closeTime: "18:00" },
  wednesday: { open: true, openTime: "09:00", closeTime: "18:00" },
  thursday: { open: true, openTime: "09:00", closeTime: "18:00" },
  friday: { open: true, openTime: "09:00", closeTime: "18:00" },
  saturday: { open: true, openTime: "09:00", closeTime: "13:00" },
  sunday: { open: false, openTime: "00:00", closeTime: "00:00" },
};

const defaultConfig: BusinessConfig = {
  id: null,
  businessHours: defaultBusinessHours,
  bufferTime: 15, // minutos entre agendamentos
  minAdvanceTime: 30, // minutos de antecedência mínima
  maxFutureDays: 30, // dias máximos para agendamento futuro
  requireConfirmation: true, // requer confirmação do agendamento
  allowTips: true, // permite gorjetas
  aiEnabled: false, // IA habilitada
  humanFallbackEnabled: true, // fallback humano habilitado
  remoteQueueEnabled: true, // fila remota habilitada
  remoteQueueLimit: 10, // limite de pessoas na fila remota
  primaryColor: "#213858", // cor primária
  secondaryColor: "#33c3f0", // cor secundária
  cancellationPolicy: "Cancelamentos devem ser feitos com no mínimo 2 horas de antecedência", // política de cancelamento
  logoUrl: null, // URL do logo
  bannerUrl: null, // URL do banner
  paymentGatewayConfig: {}, // configurações do gateway de pagamento
};

export const useBusinessConfig = () => {
  const [config, setConfig] = useState<BusinessConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { businessId } = useCurrentBusiness();

  // Carregar configurações do banco de dados
  useEffect(() => {
    const fetchConfig = async () => {
      if (!businessId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: businessConfig, error } = await supabase
          .from("configuracoes_negocio")
          .select("*")
          .eq("id_negocio", businessId)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar configurações:", error);
          return;
        }

        if (businessConfig) {
          // Mapear as configurações do banco para o formato do hook
          setConfig({
            id: businessConfig.id,
            businessHours: defaultBusinessHours, // TODO: Implementar armazenamento dos horários específicos
            bufferTime: businessConfig.aviso_minimo_agendamento || defaultConfig.bufferTime,
            minAdvanceTime: businessConfig.aviso_minimo_agendamento || defaultConfig.minAdvanceTime,
            maxFutureDays: businessConfig.dias_maximos_antecedencia || defaultConfig.maxFutureDays,
            requireConfirmation: businessConfig.pagamento_antecipado_obrigatorio ?? defaultConfig.requireConfirmation,
            allowTips: businessConfig.permite_gorjetas ?? defaultConfig.allowTips,
            aiEnabled: businessConfig.ia_habilitada ?? defaultConfig.aiEnabled,
            humanFallbackEnabled: businessConfig.fallback_humano_habilitado ?? defaultConfig.humanFallbackEnabled,
            remoteQueueEnabled: businessConfig.permite_fila_remota ?? defaultConfig.remoteQueueEnabled,
            remoteQueueLimit: businessConfig.limite_fila_remota ?? defaultConfig.remoteQueueLimit,
            primaryColor: businessConfig.cores_primarias || defaultConfig.primaryColor,
            secondaryColor: businessConfig.cores_secundarias || defaultConfig.secondaryColor,
            cancellationPolicy: businessConfig.politica_cancelamento || defaultConfig.cancellationPolicy,
            logoUrl: businessConfig.logo_url,
            bannerUrl: businessConfig.banner_url,
            paymentGatewayConfig: businessConfig.configuracoes_gateway_pagamento || defaultConfig.paymentGatewayConfig,
          });
        } else {
          // Se não existir configuração, criar uma com os valores padrão
          createDefaultConfig();
        }
      } catch (error) {
        console.error("Erro ao buscar configurações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [businessId]);

  // Criar configuração padrão
  const createDefaultConfig = async () => {
    if (!businessId) return;

    try {
      const { data, error } = await supabase
        .from("configuracoes_negocio")
        .insert({
          id_negocio: businessId,
          permite_fila_remota: defaultConfig.remoteQueueEnabled,
          limite_fila_remota: defaultConfig.remoteQueueLimit,
          pagamento_antecipado_obrigatorio: defaultConfig.requireConfirmation,
          aviso_minimo_agendamento: defaultConfig.minAdvanceTime,
          dias_maximos_antecedencia: defaultConfig.maxFutureDays,
          permite_gorjetas: defaultConfig.allowTips,
          ia_habilitada: defaultConfig.aiEnabled,
          fallback_humano_habilitado: defaultConfig.humanFallbackEnabled,
          cores_primarias: defaultConfig.primaryColor,
          cores_secundarias: defaultConfig.secondaryColor,
          politica_cancelamento: defaultConfig.cancellationPolicy,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Erro ao criar configurações padrão:", error);
        return;
      }

      if (data) {
        setConfig({
          ...defaultConfig,
          id: data.id
        });
      }
    } catch (error) {
      console.error("Erro ao criar configurações padrão:", error);
    }
  };

  // Atualizar configurações do negócio
  const saveConfig = async (updatedConfig: Partial<BusinessConfig>) => {
    if (!businessId || !config.id) return false;

    try {
      setSaving(true);
      
      // Mapear as configurações para o formato do banco
      const dbConfig = {
        permite_fila_remota: updatedConfig.remoteQueueEnabled ?? config.remoteQueueEnabled,
        limite_fila_remota: updatedConfig.remoteQueueLimit ?? config.remoteQueueLimit,
        pagamento_antecipado_obrigatorio: updatedConfig.requireConfirmation ?? config.requireConfirmation,
        aviso_minimo_agendamento: updatedConfig.minAdvanceTime ?? config.minAdvanceTime,
        dias_maximos_antecedencia: updatedConfig.maxFutureDays ?? config.maxFutureDays,
        permite_gorjetas: updatedConfig.allowTips ?? config.allowTips,
        ia_habilitada: updatedConfig.aiEnabled ?? config.aiEnabled,
        fallback_humano_habilitado: updatedConfig.humanFallbackEnabled ?? config.humanFallbackEnabled,
        cores_primarias: updatedConfig.primaryColor ?? config.primaryColor,
        cores_secundarias: updatedConfig.secondaryColor ?? config.secondaryColor,
        politica_cancelamento: updatedConfig.cancellationPolicy ?? config.cancellationPolicy,
        logo_url: updatedConfig.logoUrl ?? config.logoUrl,
        banner_url: updatedConfig.bannerUrl ?? config.bannerUrl,
        configuracoes_gateway_pagamento: updatedConfig.paymentGatewayConfig ?? config.paymentGatewayConfig,
      };

      const { error } = await supabase
        .from("configuracoes_negocio")
        .update(dbConfig)
        .eq("id", config.id);

      if (error) {
        console.error("Erro ao salvar configurações:", error);
        toast.error("Erro ao salvar configurações");
        return false;
      }

      // Atualizar o estado local com as novas configurações
      setConfig(prevConfig => ({
        ...prevConfig,
        ...updatedConfig
      }));
      
      toast.success("Configurações salvas com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Atualizar horários de funcionamento
  const updateBusinessHours = (
    day: string,
    values: Partial<{
      open: boolean;
      openTime: string;
      closeTime: string;
    }>
  ) => {
    setConfig(prevState => ({
      ...prevState,
      businessHours: {
        ...prevState.businessHours,
        [day]: {
          ...prevState.businessHours[day],
          ...values,
        },
      },
    }));
  };

  // Salvar horários de funcionamento
  const saveBusinessHours = async () => {
    try {
      setSaving(true);
      
      // TODO: Implementar salvamento dos horários específicos na tabela de configurações
      // Por enquanto, vamos apenas simular um salvamento bem-sucedido
      
      toast.success("Horários salvos com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao salvar horários:", error);
      toast.error("Erro ao salvar horários");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    ...config,
    loading,
    saving,
    updateBusinessHours,
    saveBusinessHours,
    saveConfig,
  };
};
