
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
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  serviceName: string;
  transactionId?: string;
  paymentUrl?: string;
};

// Temporary business ID for demo purposes
const TEMP_BUSINESS_ID = "00000000-0000-0000-0000-000000000000";

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
        .from('transactions')
        .select(`
          id, 
          status, 
          amount, 
          payment_method, 
          created_at, 
          updated_at, 
          notes,
          client:client_id (
            name
          )
        `)
        .eq('business_id', TEMP_BUSINESS_ID)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Handle potential null data
      if (!data || data.length === 0) {
        // Provide sample data for demonstration purposes
        const sampleData = [
          {
            id: '1',
            status: 'PAID',
            amount: 150.00,
            payment_method: 'credit_card',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            notes: JSON.stringify({
              transaction_id: 'TXN12345',
              payment_url: 'https://example.com/payment/12345',
              service_name: 'Corte de Cabelo'
            }),
            client: { name: 'João Silva' }
          },
          {
            id: '2',
            status: 'PENDING',
            amount: 80.00,
            payment_method: 'pix',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            notes: JSON.stringify({
              transaction_id: 'TXN12346',
              payment_url: 'https://example.com/payment/12346',
              service_name: 'Barba'
            }),
            client: { name: 'Maria Souza' }
          }
        ];
        
        const formattedData = sampleData.map(formatTransactionData);
        setTransactions(formattedData);
        return;
      }

      const formattedData = data.map(formatTransactionData);
      setTransactions(formattedData);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      setError("Falha ao carregar transações. Por favor, tente novamente.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTransactionData = (item: any): PaymentTransaction => {
    // Parse transaction ID and payment URL from notes
    let transactionId = '';
    let paymentUrl = '';
    let serviceName = 'N/A';
    
    if (item.notes) {
      try {
        const notesData = JSON.parse(item.notes);
        transactionId = notesData.transaction_id || '';
        paymentUrl = notesData.payment_url || '';
        serviceName = notesData.service_name || 'N/A';
      } catch (e) {
        console.log("Notes is not valid JSON");
      }
    }
    
    // Get client name safely
    let customerName = "Cliente não identificado";
    if (item.client && item.client.name) {
      customerName = item.client.name;
    }
    
    return {
      id: item.id,
      status: item.status,
      amount: item.amount,
      paymentMethod: item.payment_method || '',
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      customerName: customerName,
      serviceName: serviceName,
      transactionId,
      paymentUrl
    };
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
      default: return method || "Não informado";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Data inválida";
    }
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
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell>{transaction.customerName}</TableCell>
                    <TableCell>{transaction.serviceName}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>{getPaymentMethodLabel(transaction.paymentMethod)}</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={transaction.status as any} />
                    </TableCell>
                    <TableCell>
                      {transaction.transactionId || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.paymentUrl && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.open(transaction.paymentUrl, '_blank')}
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
