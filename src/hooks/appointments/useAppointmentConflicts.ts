import { useState } from "react";
import { addMinutes } from "date-fns";
import { Appointment } from "@/components/appointments/types";
import { useBusinessHours } from "@/hooks/useBusinessHours";

export interface ConflictCheckParams {
  date: Date;
  duration: number;
  professionalId?: string;
  appointmentId?: string; // Para excluir o próprio agendamento ao verificar edições
}

export const useAppointmentConflicts = (appointments: Appointment[]) => {
  const [checking, setChecking] = useState(false);
  const { isWithinBusinessHours } = useBusinessHours();
  
  // Verifica se o horário está dentro do funcionamento
  const checkBusinessHours = (date: Date): boolean => {
    return isWithinBusinessHours(date);
  };
  
  // Verifica conflitos com tempo mínimo de antecedência
  const checkAdvanceTime = (date: Date): boolean => {
    const now = new Date();
    const minAdvanceMinutes = 30; // 30 minutos de antecedência mínima (ajustável)
    const minAllowedTime = addMinutes(now, minAdvanceMinutes);
    
    return date >= minAllowedTime;
  };
  
  // Verifica conflitos com outros agendamentos
  const checkOverlap = (params: ConflictCheckParams): boolean => {
    setChecking(true);
    
    try {
      const { date, duration, professionalId, appointmentId } = params;
      
      // Se não tiver profissional associado, não há como verificar conflito
      if (!professionalId) return true;
      
      // Calcular o horário de término
      const endDate = addMinutes(date, duration);
      
      // Filtrar apenas agendamentos do mesmo profissional
      // e ignorar o próprio agendamento se for uma edição
      const professionalAppointments = appointments.filter(app => 
        app.professionalId === professionalId && 
        app.id !== appointmentId
      );
      
      // Verificar se existe algum agendamento que se sobrepõe
      const hasConflict = professionalAppointments.some(app => {
        const appEndDate = addMinutes(app.date, app.duration);
        
        // Verifica se o novo agendamento começa durante outro agendamento existente
        const startsInExistingApp = date >= app.date && date < appEndDate;
        
        // Verifica se o novo agendamento termina durante outro agendamento existente
        const endsInExistingApp = endDate > app.date && endDate <= appEndDate;
        
        // Verifica se o novo agendamento engloba completamente outro agendamento existente
        const containsExistingApp = date <= app.date && endDate >= appEndDate;
        
        return startsInExistingApp || endsInExistingApp || containsExistingApp;
      });
      
      // Retorna true se NÃO houver conflito
      return !hasConflict;
    } finally {
      setChecking(false);
    }
  };
  
  // Verifica o tempo de buffer entre agendamentos
  const checkBuffer = (params: ConflictCheckParams): boolean => {
    const { date, duration, professionalId, appointmentId } = params;
    
    // Se não tiver profissional associado, não há como verificar buffer
    if (!professionalId) return true;
    
    const bufferMinutes = 15; // 15 minutos de buffer entre agendamentos
    
    // Calcular o horário de término com buffer
    const endDate = addMinutes(date, duration);
    const startWithBuffer = addMinutes(date, -bufferMinutes);
    const endWithBuffer = addMinutes(endDate, bufferMinutes);
    
    // Filtrar apenas agendamentos do mesmo profissional
    // e ignorar o próprio agendamento se for uma edição
    const professionalAppointments = appointments.filter(app => 
      app.professionalId === professionalId && 
      app.id !== appointmentId
    );
    
    // Verificar se existe algum agendamento dentro do buffer
    const hasBufferConflict = professionalAppointments.some(app => {
      const appEndDate = addMinutes(app.date, app.duration);
      
      // Verifica se o início com buffer sobrepõe o fim de outro agendamento
      const startBufferConflict = startWithBuffer >= app.date && startWithBuffer < appEndDate;
      
      // Verifica se o fim com buffer sobrepõe o início de outro agendamento
      const endBufferConflict = endWithBuffer > app.date && endWithBuffer <= appEndDate;
      
      return startBufferConflict || endBufferConflict;
    });
    
    // Retorna true se NÃO houver conflito de buffer
    return !hasBufferConflict;
  };
  
  // Função consolidada que verifica todas as validações
  const validateAppointmentTime = (params: ConflictCheckParams): { 
    valid: boolean; 
    reason?: string;
  } => {
    // Verificar se está dentro do horário de funcionamento
    if (!checkBusinessHours(params.date)) {
      return { 
        valid: false, 
        reason: "O horário está fora do período de funcionamento do estabelecimento."
      };
    }
    
    // Verificar tempo mínimo de antecedência
    if (!checkAdvanceTime(params.date)) {
      return { 
        valid: false, 
        reason: "É necessário agendar com pelo menos 30 minutos de antecedência."
      };
    }
    
    // Verificar conflito com outros agendamentos
    if (!checkOverlap(params)) {
      return { 
        valid: false, 
        reason: "Existe um conflito com outro agendamento para este profissional no mesmo horário."
      };
    }
    
    // Verificar tempo de buffer entre agendamentos
    if (!checkBuffer(params)) {
      return { 
        valid: false, 
        reason: "É necessário um intervalo mínimo de 15 minutos entre agendamentos."
      };
    }
    
    // Se passou por todas as validações, retorna válido
    return { valid: true };
  };
  
  return {
    checking,
    validateAppointmentTime,
    checkBusinessHours,
    checkAdvanceTime,
    checkOverlap,
    checkBuffer
  };
}; 