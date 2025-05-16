export interface Appointment {
  id: string;
  id_negocio: string;
  id_cliente: string;
  id_funcionario: string;
  id_servico: string;
  data: string;
  hora: string;
  duracao: number;
  valor: number;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido';
  forma_pagamento: string;
  servicos_adicionais?: {
    id_servico: string;
    duracao: number;
    valor: number;
  }[];
  notificacoes?: {
    enviar_confirmacao: boolean;
    enviar_lembrete: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  cliente_id: string;
  profissional_id: string;
  servico_id: string;
  data_hora: string;
  duracao: number;
  valor: number;
  observacoes?: string;
  notifications?: {
    sendConfirmation: boolean;
    sendReminder: boolean;
  };
}

export interface UpdateAppointmentData {
  status?: Appointment['status'];
  data_hora?: string;
  duracao?: number;
  valor?: number;
  observacoes?: string;
  forma_pagamento?: string;
} 