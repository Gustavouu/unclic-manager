
export interface Transaction {
  id: string;
  tipo: string;
  valor: number;
  metodo_pagamento: string;
  status: string;
  descricao: string;
  criado_em: string;
  data_pagamento?: string;
  customer_name?: string;
  cliente?: {
    nome: string;
  };
  servico?: {
    nome: string;
  };
}

export interface TransactionsTableProps {
  isLoading: boolean;
  filterType?: "all" | "receita" | "despesa";
  period?: string;
  currentPage?: number;
  pageSize?: number;
  setCurrentPage?: (page: number) => void;
  setPageSize?: (size: number) => void;
  searchTerm?: string;
  dateRange?: [Date | null, Date | null];
  statusFilter?: string[];
  typeFilter?: string[];
}
