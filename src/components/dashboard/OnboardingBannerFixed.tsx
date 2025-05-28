
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function OnboardingBannerFixed() {
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [onboardingProgress] = useState<number>(25);
  const navigate = useNavigate();
  
  const handleContinueSetup = () => {
    navigate('/onboarding');
  };
  
  const handleDismiss = () => {
    setShowBanner(false);
  };
  
  if (!showBanner) {
    return null;
  }
  
  return (
    <Card className="mb-6 border-blue-100">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <CardTitle className="text-blue-800">Complete a configuração do seu negócio</CardTitle>
        <CardDescription className="text-blue-600">
          Vamos começar a configurar seu negócio para você aproveitar todos os recursos.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progresso</span>
              <span>{Math.round(onboardingProgress)}%</span>
            </div>
            <Progress value={onboardingProgress} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t flex justify-between">
        <Button variant="ghost" onClick={handleDismiss}>
          Dispensar
        </Button>
        <Button onClick={handleContinueSetup}>
          Iniciar Configuração
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
