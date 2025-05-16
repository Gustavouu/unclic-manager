
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
        
        // First try modern table (financial_transactions)
        let data: any[] = [];
        
        try {
          const response = await supabase
            .from('financial_transactions')
            .select(`
              id,
              type as tipo,
              amount as valor,
              paymentMethod as metodo_pagamento,
              status,
              description as descricao,
              createdAt as criado_em,
              paymentDate as data_pagamento,
              customer:customerId (
                name as nome
              )
            `)
            .eq('tenantId', businessId);
            
          if (!response.error && response.data && response.data.length > 0) {
            data = response.data;
          }
        } catch (error) {
          console.error("Error fetching from financial_transactions:", error);
        }
        
        // If no data, try legacy table
        if (data.length === 0) {
          try {
            console.log("Trying legacy transactions table");
            const { data: legacyData, error: legacyError } = await supabase
              .from('transactions')
              .select(`
                id,
                type as tipo,
                amount as valor,
                payment_method as metodo_pagamento,
                status,
                description as descricao,
                created_at as criado_em,
                payment_date as data_pagamento,
                client:client_id (
                  name as nome
                )
              `)
              .eq('business_id', businessId);
              
            if (!legacyError && legacyData && legacyData.length > 0) {
              data = legacyData;
            }
          } catch (legacyError) {
            console.error("Error fetching from transactions:", legacyError);
          }
        }
        
        // Filter by type if needed
        if (filterType !== "all") {
          data = data.filter(item => 
            (item.tipo === filterType) || 
            (filterType === "receita" && item.tipo === "INCOME") ||
            (filterType === "despesa" && item.tipo === "EXPENSE")
          );
        }
        
        // Filter by period
        if (period === "7days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          data = data.filter(item => new Date(item.criado_em) >= sevenDaysAgo);
        } else if (period === "30days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          data = data.filter(item => new Date(item.criado_em) >= thirtyDaysAgo);
        } else if (period === "90days") {
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          data = data.filter(item => new Date(item.criado_em) >= ninetyDaysAgo);
        }
        
        // Filter by specific date
        if (searchDate) {
          const startOfDay = new Date(searchDate);
          startOfDay.setHours(0, 0, 0, 0);
          
          const endOfDay = new Date(searchDate);
          endOfDay.setHours(23, 59, 59, 999);
          
          data = data.filter(item => {
            const itemDate = new Date(item.criado_em);
            return itemDate >= startOfDay && itemDate <= endOfDay;
          });
        }
        
        // Text search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          data = data.filter(item => 
            (item.descricao && item.descricao.toLowerCase().includes(query)) ||
            (item.customer_name && item.customer_name.toLowerCase().includes(query)) ||
            (item.customer && item.customer.nome && item.customer.nome.toLowerCase().includes(query)) ||
            (item.client && item.client.nome && item.client.nome.toLowerCase().includes(query))
          );
        }

        // Process the data to ensure it matches our Transaction interface
        const processedData: Transaction[] = data.map(item => {
          // Handle cliente properly
          let customerName = "Cliente não identificado";
          let cliente: { nome: string } | undefined = undefined;
          
          if (item.customer) {
            if (typeof item.customer === 'object' && item.customer !== null) {
              if ('nome' in item.customer) {
                customerName = item.customer.nome || "Cliente não identificado";
                cliente = { nome: customerName };
              }
            }
          } else if (item.client) {
            if (typeof item.client === 'object' && item.client !== null) {
              if ('nome' in item.client) {
                customerName = item.client.nome || "Cliente não identificado";
                cliente = { nome: customerName };
              }
            }
          }
          
          return {
            id: item.id,
            tipo: item.tipo,
            valor: item.valor,
            metodo_pagamento: item.metodo_pagamento,
            status: item.status,
            descricao: item.descricao,
            criado_em: item.criado_em,
            data_pagamento: item.data_pagamento,
            customer_name: customerName,
            cliente
          };
        });
        
        setTransactions(processedData);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
        setTransactions([]);
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
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const currentTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const renderPagination = () => {
    if (!transactions || transactions.length <= itemsPerPage) return null;
    
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
            ) : currentTransactions && currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {formatDate(transaction.criado_em)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={transaction.descricao}>
                    {transaction.descricao || "—"}
                  </TableCell>
                  <TableCell>
                    {transaction.cliente?.nome || transaction.customer_name || "Cliente não identificado"}
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodLabel(transaction.metodo_pagamento)}
                  </TableCell>
                  <TableCell className={transaction.tipo === "receita" || transaction.tipo === "INCOME" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {transaction.tipo === "despesa" || transaction.tipo === "EXPENSE" ? "- " : ""}{formatCurrency(transaction.valor)}
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
