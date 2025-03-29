
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "../types";
import { formatPrice } from "@/components/website/WebsiteUtils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle } from "lucide-react";

interface StepConfirmationProps {
  bookingData: BookingData;
  businessName: string;
  onComplete: () => void;
}

export function StepConfirmation({ bookingData, businessName, onComplete }: StepConfirmationProps) {
  // Trigger the onComplete callback to close the flow after a delay
  setTimeout(() => {
    onComplete();
  }, 5000);

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-green-600">Agendamento Confirmado!</CardTitle>
        <p className="text-muted-foreground mt-2">
          Sua reserva foi realizada com sucesso
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-3 text-center">Detalhes da reserva</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estabelecimento:</span>
              <span className="font-medium">{businessName}</span>
            </div>
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor:</span>
              <span className="font-bold">{formatPrice(bookingData.servicePrice)}</span>
            </div>
            {bookingData.notes && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Observações:</span>
                <span>{bookingData.notes}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Um comprovante foi enviado para o seu email e telefone.</p>
          <p className="mt-2">Esta janela será fechada automaticamente em alguns segundos.</p>
        </div>
      </CardContent>
    </Card>
  );
}
