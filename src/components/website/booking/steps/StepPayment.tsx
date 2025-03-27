
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "../WebsiteBookingFlow";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreditCard, Cash, Smartphone } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/components/website/WebsiteUtils";

interface StepPaymentProps {
  bookingData: BookingData;
  nextStep: () => void;
}

export function StepPayment({
  bookingData,
  nextStep
}: StepPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      nextStep();
    }, 2000);
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Pagamento</CardTitle>
        <p className="text-muted-foreground mt-2">
          Confirme os detalhes e escolha seu método de pagamento
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <h3 className="font-medium">Resumo do agendamento</h3>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Serviço:</div>
            <div className="font-medium">{bookingData.serviceName}</div>
            
            <div className="text-muted-foreground">Profissional:</div>
            <div className="font-medium">{bookingData.professionalName}</div>
            
            <div className="text-muted-foreground">Data:</div>
            <div className="font-medium">
              {bookingData.date 
                ? format(bookingData.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                : ""}
            </div>
            
            <div className="text-muted-foreground">Hora:</div>
            <div className="font-medium">{bookingData.time}</div>
            
            <div className="text-muted-foreground">Valor:</div>
            <div className="font-medium">{formatPrice(bookingData.servicePrice)}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Escolha a forma de pagamento</h3>
          
          <RadioGroup 
            defaultValue={paymentMethod} 
            onValueChange={setPaymentMethod}
            className="grid gap-4"
          >
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label 
                  htmlFor="credit_card" 
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  Cartão de Crédito
                </Label>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pix" id="pix" />
                <Label 
                  htmlFor="pix" 
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Smartphone className="h-4 w-4" />
                  PIX
                </Label>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label 
                  htmlFor="cash" 
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Cash className="h-4 w-4" />
                  Dinheiro no Local
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handlePayment} 
          disabled={isProcessing}
        >
          {isProcessing ? "Processando..." : "Finalizar Agendamento"}
        </Button>
      </CardFooter>
    </Card>
  );
}
