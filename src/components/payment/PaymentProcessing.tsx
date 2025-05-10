
import { AsyncFeedback } from '@/components/ui/async-feedback';

const PaymentProcessing = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <AsyncFeedback
        status="loading"
        message="Processando pagamento"
        description="Estamos processando seu pagamento. Por favor, não feche esta janela."
        size="lg"
      />
    </div>
  );
};

export default PaymentProcessing;
