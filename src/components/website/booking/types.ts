
export interface BookingFlowProps {
  businessName: string;
  closeFlow: () => void;
  services?: any[];
  staff?: any[];
}

export interface ClientData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface BookingData {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  professionalId: string;
  professionalName: string;
  date?: Date;
  time: string;
  notes: string;
}

export interface ExtendedServiceData {
  id: string;
  nome: string;
  descricao: string;
  duracao: number;
  preco: number;
  ativo: boolean;
}

export interface ExtendedStaffData {
  id: string;
  nome: string;
  cargo: string;
  especializacoes: string[];
  foto_url: string;
  bio: string;
}
