
import { useCurrentBusiness } from "./useCurrentBusiness";

export const useBusinessHours = () => {
  // Esta é uma implementação simplificada. Em um cenário real, isso buscaria os horários
  // do banco de dados ou de alguma configuração
  
  // Horários padrão de funcionamento: 9h às 18h
  const defaultOpenHour = 9;
  const defaultCloseHour = 18;

  // Verifica se o horário está dentro do funcionamento
  const isWithinBusinessHours = (date: Date): boolean => {
    const hour = date.getHours();
    const dayOfWeek = date.getDay();
    
    // Verificar se é fim de semana (0 = domingo, 6 = sábado)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Aos finais de semana, considera apenas das 10h às 14h
    if (isWeekend) {
      return hour >= 10 && hour < 14;
    }
    
    // Durante a semana, usa o horário comercial padrão
    return hour >= defaultOpenHour && hour < defaultCloseHour;
  };

  return {
    isWithinBusinessHours,
    businessHours: {
      open: defaultOpenHour,
      close: defaultCloseHour
    }
  };
};
