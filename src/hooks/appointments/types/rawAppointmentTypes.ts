
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
  serviceType?: string; // Adding serviceType field that was missing
  clientes?: {
    id: string;
    nome: string;
    email?: string;
  } | null; // Make null possible
  servicos?: {
    id: string;
    nome: string;
    preco?: number;
  } | null; // Make null possible
  funcionarios?: {
    id: string;
    nome: string;
  } | null; // Make null possible
}
