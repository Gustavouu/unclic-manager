import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { formatCurrency } from "@/lib/formatters";
import { Check, ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";

interface PaymentResultProps {
  paymentResult: {
    status: "pending" | "approved" | "rejected" | "cancelled" | "processing";
    transactionId?: string;
  };
  paymentUrl?: string | null;
  openPaymentUrl?: () => void;
  onClose: () => void;
  amount: number;
  serviceName: string;
  appointmentDate?: string;
  paymentMethod?: string;
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCount, setVerificationCount] = useState(0);
  
  const isPix = paymentMethod === "pix";
  const isPending = paymentResult.status === "pending";
  const isRejected = paymentResult.status === "rejected";
  
  const handleVerifyPayment = () => {
    setIsVerifying(true);
    
    // Simulate payment verification
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationCount(prev => prev + 1);
      
      // If this is the second verification, simulate a successful payment
      if (verificationCount === 1) {
        paymentResult.status = "approved";
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <PaymentStatusBadge status={paymentResult.status} className="mx-auto mb-3" />
        
        <h3 className="text-xl font-semibold mb-2">
          {paymentResult.status === "approved" && "Pagamento concluído!"}
          {paymentResult.status === "pending" && "Pagamento pendente"}
          {paymentResult.status === "rejected" && "Pagamento recusado"}
          {paymentResult.status === "processing" && "Processando pagamento..."}
          {paymentResult.status === "cancelled" && "Pagamento cancelado"}
        </h3>
        
        <p className="text-muted-foreground">
          {paymentResult.status === "approved" && "Seu pagamento foi processado com sucesso."}
          {paymentResult.status === "pending" && 
            (isPix 
              ? "Escaneie o QR Code PIX para finalizar o pagamento." 
              : "Aguardando confirmação do pagamento.")
          }
          {paymentResult.status === "rejected" && "Houve um problema ao processar seu pagamento."}
          {paymentResult.status === "processing" && "Seu pagamento está sendo processado."}
          {paymentResult.status === "cancelled" && "O pagamento foi cancelado."}
        </p>
      </div>
      
      {/* Display PIX QR Code if applicable */}
      {isPix && isPending && paymentUrl && (
        <div className="flex flex-col items-center mt-4 mb-6">
          <div className="border p-4 bg-white rounded-lg">
            <img 
              src={paymentUrl} 
              alt="QR Code Pix" 
              width={200} 
              height={200} 
              className="mx-auto"
            />
          </div>
          <p className="text-sm text-center mt-2 text-muted-foreground">
            O QR Code expira em 60 minutos
          </p>
          
          {openPaymentUrl && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 flex items-center gap-1"
              onClick={openPaymentUrl}
            >
              <ExternalLink className="h-4 w-4" />
              Abrir link de pagamento
            </Button>
          )}
          
          <Button 
            onClick={handleVerifyPayment} 
            className="mt-4" 
            variant="default"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <span className="flex items-center">
                <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                Verificando...
              </span>
            ) : (
              <span className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Já realizei o pagamento
              </span>
            )}
          </Button>
        </div>
      )}
      
      <div className="bg-muted p-4 rounded-md space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Serviço:</span>
          <span className="font-medium">{serviceName}</span>
        </div>
        
        {appointmentDate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data:</span>
            <span className="font-medium">{appointmentDate}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Valor:</span>
          <span className="font-bold">{formatCurrency(amount)}</span>
        </div>
        
        {paymentResult.transactionId && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transação:</span>
            <span className="font-medium text-xs">
              {paymentResult.transactionId}
            </span>
          </div>
        )}
      </div>
      
      <DialogFooter>
        <Button onClick={onClose}>
          Concluir
        </Button>
      </DialogFooter>
    </div>
  );
};
