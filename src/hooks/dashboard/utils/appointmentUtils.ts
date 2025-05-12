
import { AppointmentData, UpcomingAppointmentData, FormattedAppointment } from '../models/dashboardTypes';

/**
 * Formats upcoming appointments data
 */
export const formatUpcomingAppointments = (appointmentsData: UpcomingAppointmentData[] | null): FormattedAppointment[] => {
  if (!appointmentsData) return [];
  
  return appointmentsData.map(app => {
    // Safely access properties with appropriate type handling
    const clientesData = app.clientes as { nome?: string } | null;
    const servicosData = app.servicos as { nome?: string } | null;
    const funcionariosData = app.funcionarios as { nome?: string } | null;
    
    // Extract names with fallbacks
    const clientName = clientesData?.nome || "Cliente não identificado";
    const serviceName = servicosData?.nome || "Serviço não identificado";
    const professionalName = funcionariosData?.nome || "Profissional não identificado";
    
    return {
      id: app.id,
      clientName,
      serviceName,
      professionalName,
      date: `${app.data}T${app.hora_inicio}`,
      status: app.status,
      price: app.valor
    };
  });
};

/**
 * Calculates revenue data by day from appointments
 */
export const calculateRevenueByDay = (appointmentsData: AppointmentData[] | null) => {
  if (!appointmentsData || appointmentsData.length === 0) {
    return [];
  }
  
  const revenueByDay = new Map<string, number>();
  
  appointmentsData.forEach(app => {
    const day = app.data;
    revenueByDay.set(day, (revenueByDay.get(day) || 0) + (app.valor || 0));
  });
  
  return Array.from(revenueByDay.entries())
    .map(([date, value]) => ({
      date,
      value
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
