
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentSummary } from "./PaymentSummary";
import { ExternalLink } from "lucide-react";

interface PaymentResultProps {
  paymentResult: {
    status: "pending" | "approved" | "rejected" | "cancelled" | "processing";
    transactionId?: string;
  };
  paymentUrl: string | null;
  openPaymentUrl: () => void;
  onClose: () => void;
  amount: number;
  serviceName: string;
  appointmentDate?: string;
  paymentMethod: string;
}

export const PaymentResult = ({
  paymentResult,
  paymentUrl,
  openPaymentUrl,
  onClose,
  amount,
  serviceName,
  appointmentDate,
  paymentMethod,
}: PaymentResultProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-4">
        <PaymentStatusBadge 
          status={paymentResult.status} 
          className="text-base px-3 py-1 mb-4"
        />
        
        {paymentResult.status === "approved" && (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-2">
              Pagamento aprovado com sucesso!
            </p>
            {paymentResult.transactionId && (
              <p className="text-sm text-muted-foreground">
                Código da transação: {paymentResult.transactionId}
              </p>
            )}
          </div>
        )}
        
        {paymentResult.status === "rejected" && (
          <p className="text-center text-red-600">
            Não foi possível processar seu pagamento. Verifique os dados e tente novamente.
          </p>
        )}
        
        {paymentResult.status === "pending" && (
          <p className="text-center text-amber-600">
            Seu pagamento está em análise. Acompanhe o status na área de pagamentos.
          </p>
        )}
        
        {paymentResult.status === "processing" && (
          <p className="text-center text-blue-600">
            Seu pagamento está sendo processado pelo Efi Bank. Aguarde a confirmação.
          </p>
        )}
        
        {paymentUrl && (
          <Button 
            variant="outline" 
            onClick={openPaymentUrl}
            className="mt-4 flex items-center"
          >
            Abrir Página de Pagamento <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      <PaymentSummary
        amount={amount}
        serviceName={serviceName}
        appointmentDate={appointmentDate}
        paymentMethod={paymentMethod}
      />
      
      <DialogFooter>
        <Button onClick={onClose}>
          {paymentResult.status === "approved" ? "Concluir" : "Fechar"}
        </Button>
      </DialogFooter>
    </div>
  );
};
