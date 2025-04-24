
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, Calendar, Clock, Scissors, CircleDollarSign } from "lucide-react";

interface Transaction {
  id: string;
  date: Date;
  type: string;
  description: string;
  amount: number;
  paymentMethod?: string;
  status: string;
}

interface ClientHistoryTabProps {
  clientId: string;
}

export function ClientHistoryTab({ clientId }: ClientHistoryTabProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to get client transaction history
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        // In a real application, fetch data from an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setTransactions([
          {
            id: "tx1",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            type: "payment",
            description: "Pagamento - Corte de cabelo",
            amount: 50,
            paymentMethod: "Cartão de crédito",
            status: "completed"
          },
          {
            id: "tx2",
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            type: "service",
            description: "Corte de cabelo",
            amount: 50,
            status: "completed"
          },
          {
            id: "tx3",
            date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
            type: "payment",
            description: "Pagamento - Corte de cabelo + Barba",
            amount: 75,
            paymentMethod: "Pix",
            status: "completed"
          },
          {
            id: "tx4",
            date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
            type: "service",
            description: "Corte de cabelo + Barba",
            amount: 75,
            status: "completed"
          }
        ]);
      } catch (error) {
        console.error("Error fetching client history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [clientId]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const getIconForTransactionType = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-5 w-5 text-primary" />;
      case 'service':
        return <Scissors className="h-5 w-5 text-muted-foreground" />;
      default:
        return <CircleDollarSign className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Histórico do Cliente</h3>
      
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <Card key={index}>
                  <CardContent className="py-3">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-[70px]" />
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : transactions.length === 0 ? (
            <Card>
              <CardContent className="py-6 flex flex-col items-center justify-center">
                <CircleDollarSign className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
              </CardContent>
            </Card>
          ) : (
            transactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="py-3">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {getIconForTransactionType(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(transaction.date)}
                          </span>
                          <span className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            {formatTime(transaction.date)}
                          </span>
                          {transaction.paymentMethod && (
                            <span>Via {transaction.paymentMethod}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
