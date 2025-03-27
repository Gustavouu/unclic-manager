
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "../WebsiteBookingFlow";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, Calendar, Clock, User, Scissors } from "lucide-react";
import { formatPrice } from "@/components/website/WebsiteUtils";

interface StepConfirmationProps {
  bookingData: BookingData;
  businessName: string;
  closeFlow: () => void;
}

export function StepConfirmation({
  bookingData,
  businessName,
  closeFlow
}: StepConfirmationProps) {
  return (
    <Card className="border-none shadow-lg text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">Agendamento Confirmado!</CardTitle>
        <p className="text-muted-foreground mt-2">
          Seu agendamento foi realizado com sucesso em {businessName}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/30 p-5 rounded-lg max-w-md mx-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Serviço</p>
                <p className="font-medium">{bookingData.serviceName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Profissional</p>
                <p className="font-medium">{bookingData.professionalName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">
                  {bookingData.date 
                    ? format(bookingData.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : ""}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Horário</p>
                <p className="font-medium">{bookingData.time}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 flex items-center justify-center text-primary">R$</div>
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="font-medium">{formatPrice(bookingData.servicePrice)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm">
          Um e-mail de confirmação foi enviado para você com os detalhes do agendamento.
          Se precisar alterar ou cancelar, entre em contato conosco.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={closeFlow}
        >
          Voltar para o Site
        </Button>
      </CardFooter>
    </Card>
  );
}
