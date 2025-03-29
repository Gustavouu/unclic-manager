
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "../types";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/components/website/WebsiteUtils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreditCard, Landmark, Banknote, CheckCircle2 } from "lucide-react";

interface StepPaymentProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  nextStep: () => void;
}

export function StepPayment({ bookingData, updateBookingData, nextStep }: StepPaymentProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  const paymentMethods = [
    { id: "credit", name: "Cartão de Crédito", icon: <CreditCard className="h-5 w-5" /> },
    { id: "pix", name: "PIX", icon: <Landmark className="h-5 w-5" /> },
    { id: "cash", name: "Dinheiro no Local", icon: <Banknote className="h-5 w-5" /> },
  ];

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleSubmit = () => {
    updateBookingData({ notes: `Método de pagamento: ${selectedPaymentMethod}` });
    nextStep();
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Pagamento</CardTitle>
        <p className="text-muted-foreground mt-2">
          Escolha como deseja pagar
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Resumo da reserva</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Serviço:</span>
              <span className="font-medium">{bookingData.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profissional:</span>
              <span>{bookingData.professionalName}</span>
            </div>
            {bookingData.date && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data:</span>
                <span>{format(bookingData.date, "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Horário:</span>
              <span>{bookingData.time}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor Total:</span>
              <span className="font-bold">{formatPrice(bookingData.servicePrice)}</span>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div>
          <h3 className="font-medium mb-3">Método de pagamento</h3>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => handlePaymentMethodSelect(method.id)}
                className={`
                  p-3 border rounded-lg flex items-center gap-3 cursor-pointer
                  ${selectedPaymentMethod === method.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-accent/50'
                  }
                `}
              >
                <div className="p-2 rounded-full bg-muted/50">
                  {method.icon}
                </div>
                <span className="font-medium">{method.name}</span>
                {selectedPaymentMethod === method.id && (
                  <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!selectedPaymentMethod}
          onClick={handleSubmit}
        >
          Confirmar reserva
        </Button>
      </CardFooter>
    </Card>
  );
}
