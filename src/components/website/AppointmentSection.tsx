
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle } from "lucide-react";

interface AppointmentSectionProps {
  onStartBooking: () => void;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({ onStartBooking }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2">Por que agendar conosco?</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Atendimento personalizado de alta qualidade</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Profissionais experientes e qualificados</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Ambiente confortável e acolhedor</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Agendamento rápido e prático</span>
            </li>
          </ul>
        </div>
        
        <Button 
          onClick={onStartBooking} 
          className="w-full"
          size="lg"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Agendar Serviço
        </Button>
        
        <p className="text-sm text-muted-foreground text-center">
          Clique no botão acima para agendar seu serviço conosco. Você 
          poderá escolher a data, horário e o serviço desejado.
        </p>
      </CardContent>
    </Card>
  );
};
