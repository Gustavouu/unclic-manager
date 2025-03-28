
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "../types";
import { PaymentSummary } from "./payment/PaymentSummary";
import { PaymentMethodSelector } from "./payment/PaymentMethodSelector";
import { PaymentError } from "./payment/PaymentError";
import { PaymentActions } from "./payment/PaymentActions";
import { usePaymentStep } from "./payment/usePaymentStep";

interface StepPaymentProps {
  bookingData: BookingData;
  nextStep: () => void;
}

export function StepPayment({
  bookingData,
  nextStep
}: StepPaymentProps) {
  const {
    paymentMethod,
    isProcessing,
    paymentError,
    handlePaymentMethodSelect,
    handlePayment,
    handleRetry
  } = usePaymentStep({ bookingData, nextStep });

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Pagamento</CardTitle>
        <p className="text-muted-foreground mt-2">
          Confirme os detalhes e escolha seu método de pagamento
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <PaymentError errorMessage={paymentError} />
        <PaymentSummary bookingData={bookingData} />
        <PaymentMethodSelector 
          selectedMethod={paymentMethod} 
          onSelectMethod={handlePaymentMethodSelect}
          disabled={isProcessing}
        />
      </CardContent>
      <CardFooter>
        <PaymentActions 
          isProcessing={isProcessing}
          hasError={!!paymentError}
          onRetry={handleRetry}
          onPay={handlePayment}
        />
      </CardFooter>
    </Card>
  );
}
