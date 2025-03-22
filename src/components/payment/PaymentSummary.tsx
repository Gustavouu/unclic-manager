
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

interface PaymentSummaryProps {
  amount: number;
  serviceName: string;
  appointmentDate?: string;
  paymentMethod?: string;
  className?: string;
  onProceed?: () => void;
}

export const PaymentSummary = ({
  amount,
  serviceName,
  appointmentDate,
  paymentMethod,
  className = "",
  onProceed
}: PaymentSummaryProps) => {
  
  const getPaymentMethodLabel = (method?: string) => {
    if (!method) return "Não selecionado";
    
    switch (method) {
      case "credit_card": return "Cartão de Crédito";
      case "debit_card": return "Cartão de Débito";
      case "pix": return "PIX";
      case "bank_slip": return "Boleto Bancário";
      default: return method;
    }
  };
  
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">Resumo do Pagamento</CardTitle>
        <CardDescription>Confira os detalhes antes de prosseguir</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between py-1 border-b">
          <span className="text-muted-foreground">Serviço:</span>
          <span className="font-medium">{serviceName}</span>
        </div>
        
        {appointmentDate && (
          <div className="flex justify-between py-1 border-b">
            <span className="text-muted-foreground">Data do Agendamento:</span>
            <span className="font-medium">{appointmentDate}</span>
          </div>
        )}
        
        <div className="flex justify-between py-1 border-b">
          <span className="text-muted-foreground">Forma de Pagamento:</span>
          <span className="font-medium">{getPaymentMethodLabel(paymentMethod)}</span>
        </div>
        
        <div className="flex justify-between py-2 font-bold text-lg">
          <span>Total:</span>
          <span className="text-primary">{formatCurrency(amount)}</span>
        </div>
      </CardContent>
      
      {onProceed && (
        <CardFooter>
          <button 
            onClick={onProceed}
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition"
          >
            Confirmar Pagamento
          </button>
        </CardFooter>
      )}
    </Card>
  );
};
