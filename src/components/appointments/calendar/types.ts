
export type AppointmentStatus = "agendado" | "concluído" | "cancelado";
export type ServiceType = "all" | "haircut" | "barber" | "combo" | "treatment";
export type CalendarViewType = "month" | "week" | "day";

export type AppointmentType = {
  id: string;
  clientName: string;
  serviceName: string;
  date: Date;
  status: AppointmentStatus;
  price: number;
  serviceType: ServiceType;
  duration: number;
};

// Map service types to display names for barbershop
export const SERVICE_TYPE_NAMES: Record<ServiceType, string> = {
  all: "Todos os Serviços",
  haircut: "Corte de Cabelo",
  barber: "Barba",
  combo: "Corte e Barba",
  treatment: "Tratamentos"
};
