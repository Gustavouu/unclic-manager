
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

interface StepWelcomeProps {
  nextStep: () => void;
}

export function StepWelcome({ nextStep }: StepWelcomeProps) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
          <CalendarClock className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Bem-vindo ao agendamento</CardTitle>
        <p className="text-muted-foreground mt-2">
          Vamos agendar um horário para você
        </p>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4">
          Para começar, vamos escolher o serviço que você deseja agendar.
        </p>
        <p className="text-sm text-muted-foreground">
          O processo de agendamento é simples e rápido, levando apenas alguns minutos para ser concluído.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={nextStep}
        >
          Começar agendamento
        </Button>
      </CardFooter>
    </Card>
  );
}
