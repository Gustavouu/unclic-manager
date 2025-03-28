
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatPrice } from "@/components/website/WebsiteUtils";
import { BookingData } from "../../types";

interface PaymentSummaryProps {
  bookingData: BookingData;
}

export function PaymentSummary({ bookingData }: PaymentSummaryProps) {
  return (
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
  );
}
