
export interface RawAppointmentData {
  id: string;
  id_negocio: string;
  id_cliente: string;
  id_funcionario: string;
  id_servico: string;
  data: string;
  hora_inicio: string;
  hora_fim?: string;
  duracao: number;
  valor: number;
  status: string;
  forma_pagamento?: string;
  observacoes?: string;
  clientes?: {
    id: string;
    nome: string;
    email?: string;
  };
  servicos?: {
    id: string;
    nome: string;
    preco?: number;
  };
  funcionarios?: {
    id: string;
    nome: string;
  };
}
