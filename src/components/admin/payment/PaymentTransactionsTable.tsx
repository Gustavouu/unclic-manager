
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/payment/PaymentStatusBadge";
import { formatCurrency } from "@/lib/formatters";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, RefreshCw } from "lucide-react";

type PaymentTransaction = {
  id: string;
  status: string;
  amount: number;
  payment_method: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  service_name: string;
  transaction_id?: string;
  payment_url?: string;
};

export function PaymentTransactionsTable() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('transacoes')
        .select(`
          id, 
          status, 
          valor, 
          metodo_pagamento, 
          criado_em, 
          atualizado_em, 
          notas,
          clientes(nome)
        `)
        .order('criado_em', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Handle potential null data
      if (!data) {
        setTransactions([]);
        return;
      }

      const formattedData = data.map(item => {
        // Parse transaction ID and payment URL from notes
        let transaction_id = '';
        let payment_url = '';
        let service_name = 'N/A';
        
        if (item.notas) {
          try {
            const notesData = JSON.parse(item.notas);
            transaction_id = notesData.transaction_id || '';
            payment_url = notesData.payment_url || '';
            service_name = notesData.service_name || 'N/A';
          } catch (e) {
            console.log("Notes is not valid JSON");
          }
        }
        
        // Make sure we get the cliente nome correctly
        let customerName = "Cliente não identificado";
        if (item.clientes) {
          // Check if clientes is directly an object with a nome property
          if (typeof item.clientes === 'object' && item.clientes !== null && 'nome' in item.clientes) {
            customerName = item.clientes.nome || "Cliente não identificado";
          } 
          // If it's an array, try to get the name from the first item
          else if (Array.isArray(item.clientes) && item.clientes.length > 0 && 'nome' in item.clientes[0]) {
            customerName = item.clientes[0].nome || "Cliente não identificado";
          }
        }
        
        return {
          id: item.id,
          status: item.status,
          amount: item.valor,
          payment_method: item.metodo_pagamento,
          created_at: item.criado_em,
          updated_at: item.atualizado_em,
          customer_name: customerName,
          service_name: service_name,
          transaction_id,
          payment_url
        };
      });

      setTransactions(formattedData);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      setError("Falha ao carregar transações. Por favor, tente novamente.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card": return "Cartão de Crédito";
      case "debit_card": return "Cartão de Débito";
      case "pix": return "PIX";
      case "bank_slip": return "Boleto";
      default: return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transações de Pagamento</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <p>Carregando transações...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ID Transação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Nenhuma transação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
                    <TableCell>{transaction.customer_name}</TableCell>
                    <TableCell>{transaction.service_name}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>{getPaymentMethodLabel(transaction.payment_method)}</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={transaction.status as any} />
                    </TableCell>
                    <TableCell>
                      {transaction.transaction_id || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.payment_url && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.open(transaction.payment_url, '_blank')}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink size={16} />
                          <span className="sr-only">Abrir link de pagamento</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
