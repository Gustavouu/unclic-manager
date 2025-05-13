
export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface AppointmentData {
  id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  valor: number;
  status: string;
  cliente?: {
    nome: string;
  };
  servico?: {
    nome: string;
  };
}
