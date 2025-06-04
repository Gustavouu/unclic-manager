
import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';

const UserSetupStatus = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Mock setup progress
  const setupSteps = [
    { id: 'business_info', label: 'Informações do Negócio', completed: true },
    { id: 'services', label: 'Serviços', completed: false },
    { id: 'professionals', label: 'Profissionais', completed: false },
    { id: 'schedule', label: 'Horários', completed: false },
  ];

  const completedSteps = setupSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / setupSteps.length) * 100;

  if (progressPercentage === 100) {
    return (
      <Alert className="mb-6 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Configuração inicial concluída! Seu negócio está pronto para começar.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Configuração Inicial
        </CardTitle>
        <CardDescription>
          Complete a configuração do seu negócio para aproveitar todas as funcionalidades
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso da configuração</span>
            <span>{completedSteps}/{setupSteps.length} concluído(s)</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          {setupSteps.map((step) => (
            <div key={step.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {step.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
                <span className={step.completed ? 'text-green-700' : 'text-gray-600'}>
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full" variant="outline">
          Continuar Configuração
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserSetupStatus;
