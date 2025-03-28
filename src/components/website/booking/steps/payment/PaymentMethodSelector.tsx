
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  disabled?: boolean;
}

export function PaymentMethodSelector({ 
  selectedMethod, 
  onSelectMethod,
  disabled = false
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Escolha a forma de pagamento</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          type="button"
          variant={selectedMethod === "credit_card" ? "default" : "outline"}
          className="flex items-center justify-center py-3 gap-2 h-auto"
          onClick={() => onSelectMethod("credit_card")}
          disabled={disabled}
        >
          <CreditCard className="h-5 w-5" />
          <span>Cartão de Crédito</span>
        </Button>
        
        <Button
          type="button"
          variant={selectedMethod === "pix" ? "default" : "outline"}
          className="flex items-center justify-center py-3 gap-2 h-auto"
          onClick={() => onSelectMethod("pix")}
          disabled={disabled}
        >
          <Smartphone className="h-5 w-5" />
          <span>PIX</span>
        </Button>
        
        <Button
          type="button"
          variant={selectedMethod === "cash" ? "default" : "outline"}
          className="flex items-center justify-center py-3 gap-2 h-auto"
          onClick={() => onSelectMethod("cash")}
          disabled={disabled}
        >
          <Banknote className="h-5 w-5" />
          <span>Dinheiro no Local</span>
        </Button>
      </div>
    </div>
  );
}
