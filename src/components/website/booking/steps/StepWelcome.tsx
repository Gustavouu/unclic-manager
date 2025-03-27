
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CreditCard } from "lucide-react";

interface StepWelcomeProps {
  businessName: string;
  nextStep: () => void;
}

export function StepWelcome({ businessName, nextStep }: StepWelcomeProps) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Bem-vindo ao {businessName}</CardTitle>
        <p className="text-muted-foreground mt-2">
          Estamos felizes em recebê-lo. Agende seu serviço em poucos passos.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Escolha o Serviço</h3>
            <p className="text-sm text-muted-foreground">
              Selecione entre nossos serviços profissionais
            </p>
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Agende Horário</h3>
            <p className="text-sm text-muted-foreground">
              Escolha a data e hora que funciona para você
            </p>
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Pagamento Seguro</h3>
            <p className="text-sm text-muted-foreground">
              Pague com segurança usando diversos métodos
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          size="lg"
          onClick={nextStep}
        >
          Começar Agendamento
        </Button>
      </CardFooter>
    </Card>
  );
}
