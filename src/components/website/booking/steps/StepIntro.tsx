
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";

interface StepIntroProps {
  businessName: string;
  nextStep: () => void;
}

export function StepIntro({ businessName, nextStep }: StepIntroProps) {
  return (
    <Card className="border-none shadow-lg text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <CalendarCheck className="h-12 w-12 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Agendamento Online</CardTitle>
        <p className="text-muted-foreground mt-2">
          {businessName}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            Bem-vindo ao nosso sistema de agendamento online. Aqui você pode agendar seu horário de forma rápida e fácil.
          </p>
          <p>
            Siga os passos abaixo para realizar seu agendamento:
          </p>
          <ol className="text-left list-decimal pl-5 space-y-2">
            <li>Escolha o serviço desejado</li>
            <li>Selecione o profissional de sua preferência</li>
            <li>Escolha a data e horário disponíveis</li>
            <li>Preencha seus dados para confirmação</li>
            <li>Confirme seu agendamento</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={nextStep} className="w-full">
          Iniciar Agendamento
        </Button>
      </CardFooter>
    </Card>
  );
}
