import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentStatusBadge } from "@/components/payment/PaymentStatusBadge";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/formatters";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

interface Transaction {
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

interface TransactionsTableProps {
  isLoading: boolean;
  filterType?: "all" | "receita" | "despesa";
  period?: string;
  searchDate?: Date;
  searchQuery?: string;
}

export function TransactionsTable({ 
  isLoading, 
  filterType = "all", 
  period = "30days",
  searchDate,
  searchQuery
}: TransactionsTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { businessId } = useCurrentBusiness();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('transacoes')
          .select(`
            id,
            tipo,
            valor,
            metodo_pagamento,
            status,
            descricao,
            criado_em,
            data_pagamento,
            cliente:id_cliente (
              nome
            )
          `)
          .eq('id_negocio', businessId)
          .order('criado_em', { ascending: false });
        
        if (filterType !== "all") {
          query = query.eq('tipo', filterType);
        }
        
        // Filtro por período
        if (period === "7days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          query = query.gte('criado_em', sevenDaysAgo.toISOString());
        } else if (period === "30days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          query = query.gte('criado_em', thirtyDaysAgo.toISOString());
        } else if (period === "90days") {
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          query = query.gte('criado_em', ninetyDaysAgo.toISOString());
        }
        
        // Filtro por data específica
        if (searchDate) {
          const startOfDay = new Date(searchDate);
          startOfDay.setHours(0, 0, 0, 0);
          
          const endOfDay = new Date(searchDate);
          endOfDay.setHours(23, 59, 59, 999);
          
          query = query
            .gte('criado_em', startOfDay.toISOString())
            .lte('criado_em', endOfDay.toISOString());
        }
        
        // Busca por texto (descrição ou valor)
        if (searchQuery) {
          query = query.ilike('descricao', `%${searchQuery}%`);
        }
        
        const { data, error } = await query.limit(50);

        if (error) throw error;
        
        setTransactions(data || []);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && businessId) {
      fetchTransactions();
    }
  }, [isLoading, filterType, period, searchDate, searchQuery, businessId]);

  const getPaymentMethodLabel = (method: string | null) => {
    if (!method) return "Não informado";
    
    switch (method) {
      case "credit_card": return "Cartão de Crédito";
      case "debit_card": return "Cartão de Débito";
      case "pix": return "PIX";
      case "bank_slip": return "Boleto";
      case "cash": return "Dinheiro";
      default: return method;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  // Lógica de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const renderPagination = () => {
    if (transactions.length <= itemsPerPage) return null;
    
    return (
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span className="flex items-center px-3 text-sm">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </div>
    );
  };

  const renderSkeletonRows = () => {
    return Array(5).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
      </TableRow>
    ));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Transações</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || loading ? (
              renderSkeletonRows()
            ) : currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {formatDate(transaction.criado_em)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={transaction.descricao}>
                    {transaction.descricao || "—"}
                  </TableCell>
                  <TableCell>
                    {transaction.cliente?.nome || "Cliente não identificado"}
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodLabel(transaction.metodo_pagamento)}
                  </TableCell>
                  <TableCell className={transaction.tipo === "receita" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {transaction.tipo === "despesa" ? "- " : ""}{formatCurrency(transaction.valor)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={transaction.status as any} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        {transaction.status === "pendente" && (
                          <DropdownMenuItem>Marcar como pago</DropdownMenuItem>
                        )}
                        <DropdownMenuItem>Exportar recibo</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhuma transação encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {renderPagination()}
      </CardContent>
    </Card>
  );
}
