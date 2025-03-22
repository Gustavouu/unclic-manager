
import { Loader2 } from "lucide-react";

const PaymentProcessing = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-center text-muted-foreground">
        Estamos processando seu pagamento. Por favor, não feche esta janela.
      </p>
    </div>
  );
};

export default PaymentProcessing;
