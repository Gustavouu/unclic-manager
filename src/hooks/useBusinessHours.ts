import { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { BusinessHours as OnboardingBusinessHours } from "@/contexts/onboarding/types";
import { supabase } from "@/integrations/supabase/client";

// Interface que será usada tanto pelo componente DateTimeSelect quanto pelo hook useAppointmentConflicts
export interface BusinessHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

// Valores padrão para os horários de funcionamento
const defaultBusinessHours: BusinessHours = {
  segunda: { enabled: true, start: "09:00", end: "18:00" },
  terca: { enabled: true, start: "09:00", end: "18:00" },
  quarta: { enabled: true, start: "09:00", end: "18:00" },
  quinta: { enabled: true, start: "09:00", end: "18:00" },
  sexta: { enabled: true, start: "09:00", end: "18:00" },
  sabado: { enabled: true, start: "09:00", end: "13:00" },
  domingo: { enabled: false, start: "00:00", end: "00:00" }
};

export const useBusinessHours = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHours>(defaultBusinessHours);
  
  // Buscar os horários de funcionamento do banco de dados
  useEffect(() => {
    const fetchBusinessHours = async () => {
      try {
        const { data, error } = await supabase
          .from('configuracoes_negocio')
          .select('*')
          .limit(1)
          .maybeSingle();
          
        if (error) {
          console.error("Erro ao buscar horários de funcionamento:", error);
          return;
        }
        
        // Se encontrou dados, usar os horários de configuração ou os padrões
        if (data) {
          // Aqui podemos processar os horários vindos do banco
          // Por enquanto, vamos manter os padrões
          // setBusinessHours(data.horarios_funcionamento || defaultBusinessHours);
          setBusinessHours(defaultBusinessHours);
        }
      } catch (error) {
        console.error("Erro ao buscar horários de funcionamento:", error);
      }
    };
    
    fetchBusinessHours();
  }, []);

  // Converter horários para o formato do calendário
  const getCalendarBusinessHours = (): Record<string, { isOpen: boolean; hours?: string }> => {
    const result: Record<string, { isOpen: boolean; hours?: string }> = {};
    
    // Map day names to day numbers (0=Sunday, 1=Monday, etc.)
    const dayMap: Record<string, number> = {
      domingo: 0,
      segunda: 1,
      terca: 2,
      quarta: 3,
      quinta: 4,
      sexta: 5,
      sabado: 6
    };
    
    // Convert the business hours to calendar format
    Object.entries(businessHours || defaultBusinessHours).forEach(([day, hours]) => {
      const dayNumber = dayMap[day];
      result[dayNumber] = {
        isOpen: hours.enabled,
        hours: hours.enabled ? `${hours.start} - ${hours.end}` : undefined
      };
    });
    
    return result;
  };
  
  // Verificar se um horário específico está dentro do horário de funcionamento
  const isWithinBusinessHours = (date: Date): boolean => {
    // Pegar o dia da semana (0=Domingo, 1=Segunda, etc.)
    const dayOfWeek = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Mapear números dos dias para nomes
    const dayNames = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const dayName = dayNames[dayOfWeek];
    
    // Pegar os horários de funcionamento daquele dia
    const dayHours = businessHours[dayName];
    
    // Se o negócio está fechado naquele dia, retornar falso
    if (!dayHours || !dayHours.enabled) return false;
    
    // Pegar as horas e minutos de abertura e fechamento
    const [openHour, openMinute] = dayHours.start.split(':').map(Number);
    const [closeHour, closeMinute] = dayHours.end.split(':').map(Number);
    
    // Converter todos para minutos para facilitar a comparação
    const timeInMinutes = hours * 60 + minutes;
    const openTimeInMinutes = openHour * 60 + openMinute;
    const closeTimeInMinutes = closeHour * 60 + closeMinute;
    
    // Verificar se o horário está dentro do período de funcionamento
    return timeInMinutes >= openTimeInMinutes && timeInMinutes < closeTimeInMinutes;
  };
  
  // Formatar os horários para exibição
  const formatBusinessHours = (): { day: string; hours: string }[] => {
    const dayTranslation: Record<string, string> = {
      domingo: 'Domingo',
      segunda: 'Segunda',
      terca: 'Terça',
      quarta: 'Quarta',
      quinta: 'Quinta',
      sexta: 'Sexta',
      sabado: 'Sábado'
    };
    
    return Object.entries(businessHours).map(([day, hours]) => {
      const formattedDay = dayTranslation[day] || day;
      const formattedHours = hours.enabled ? `${hours.start} - ${hours.end}` : "Fechado";
      
      return {
        day: formattedDay,
        hours: formattedHours
      };
    });
  };
  
  return {
    businessHours,
    getCalendarBusinessHours,
    isWithinBusinessHours,
    formatBusinessHours
  };
};
