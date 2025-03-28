
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface PaymentActionsProps {
  isProcessing: boolean;
  hasError: boolean;
  onRetry: () => void;
  onPay: () => void;
}

export function PaymentActions({ 
  isProcessing, 
  hasError, 
  onRetry, 
  onPay 
}: PaymentActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {hasError ? (
        <Button 
          className="w-full" 
          onClick={onRetry} 
          disabled={isProcessing}
          variant="outline"
        >
          {isProcessing ? "Processando..." : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </>
          )}
        </Button>
      ) : null}
      
      <Button 
        className="w-full" 
        onClick={onPay} 
        disabled={isProcessing}
      >
        {isProcessing ? "Processando..." : "Finalizar Agendamento"}
      </Button>
    </div>
  );
}
