import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CreditCard, User, CheckCircle2 } from "lucide-react";

interface StepWelcomeProps {
  businessName: string;
  nextStep: () => void;
}

export function StepWelcome({ businessName, nextStep }: StepWelcomeProps) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Bem-vindo a {businessName}</CardTitle>
        <p className="text-muted-foreground mt-2">
          Agende seu atendimento em poucos passos e de forma prática.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg text-center relative">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">1. Escolha o Serviço</h3>
            <p className="text-sm text-muted-foreground">
              Selecione entre nossos serviços profissionais
            </p>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
              <div className="w-8 h-1 bg-primary/20"></div>
            </div>
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg text-center relative">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">2. Escolha o Profissional</h3>
            <p className="text-sm text-muted-foreground">
              Selecione o profissional de sua preferência
            </p>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
              <div className="w-8 h-1 bg-primary/20"></div>
            </div>
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg text-center relative">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">3. Data e Hora</h3>
            <p className="text-sm text-muted-foreground">
              Escolha a data e hora que funciona para você
            </p>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
              <div className="w-8 h-1 bg-primary/20"></div>
            </div>
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg text-center relative">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">4. Pagamento</h3>
            <p className="text-sm text-muted-foreground">
              Realize o pagamento de forma segura
            </p>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
              <div className="w-8 h-1 bg-primary/20"></div>
            </div>
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">5. Confirmação</h3>
            <p className="text-sm text-muted-foreground">
              Receba a confirmação do seu agendamento
            </p>
          </div>
        </div>
        
        <div className="bg-muted/50 p-5 rounded-lg">
          <h3 className="font-medium text-lg mb-2">Por que agendar conosco?</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Atendimento personalizado de alta qualidade</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Profissionais experientes e qualificados</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Ambiente confortável e acolhedor</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Agendamento rápido e prático</span>
            </li>
          </ul>
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
