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
}

export function TransactionsTable({ isLoading, filterType = "all", period = "30days" }: TransactionsTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

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
            clientes (
              nome
            ),
            servicos (
              nome
            )
          `)
          .order('criado_em', { ascending: false });
        
        if (filterType !== "all") {
          query = query.eq('tipo', filterType);
        }
        
        if (period === "7days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          query = query.gte('criado_em', sevenDaysAgo.toISOString());
        } else if (period === "30days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          query = query.gte('criado_em', thirtyDaysAgo.toISOString());
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

    if (!isLoading) {
      fetchTransactions();
    }
  }, [isLoading, filterType, period]);

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
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {formatDate(transaction.criado_em)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={transaction.descricao}>
                    {transaction.servico?.nome || transaction.descricao || "—"}
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
      </CardContent>
    </Card>
  );
}
