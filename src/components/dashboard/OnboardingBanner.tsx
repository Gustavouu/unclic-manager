
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { safeJsonObject } from '@/utils/databaseUtils';

interface OnboardingStep {
  id: string;
  name: string;
  url: string;
  completed: boolean;
}

export function OnboardingBanner() {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [onboardingProgress, setOnboardingProgress] = useState<number>(0);
  const navigate = useNavigate();
  const { businessId } = useTenant();
  
  const steps: OnboardingStep[] = [
    { id: 'welcome', name: 'Boas vindas', url: '/onboarding/welcome', completed: false },
    { id: 'business', name: 'Negócio', url: '/onboarding/business', completed: false },
    { id: 'services', name: 'Serviços', url: '/onboarding/services', completed: false },
    { id: 'professionals', name: 'Profissionais', url: '/onboarding/professionals', completed: false },
  ];
  
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([]);
  const [nextStep, setNextStep] = useState<OnboardingStep | null>(null);
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!businessId) return;
      
      try {
        // Check if onboarding is complete
        const { data: onboardingData, error } = await supabase.rpc('verificar_completar_onboarding', {
          business_id_param: businessId
        });
        
        if (error) {
          console.error('Error checking onboarding status:', error);
          return;
        }
        
        // Process the response safely
        const onboardingResult = safeJsonObject(onboardingData);
        
        // If onboarding is already complete, hide the banner
        if (onboardingResult.success && onboardingResult.onboarding_complete) {
          setShowBanner(false);
          return;
        }
        
        // Otherwise show the banner and calculate progress
        setShowBanner(true);
        
        // Check completed steps from database
        const { data: progressData, error: progressError } = await supabase
          .from('onboarding_progress')
          .select('step, completed')
          .eq('tenantId', businessId);
        
        if (progressError) {
          console.error('Error fetching onboarding progress:', progressError);
          return;
        }
        
        if (progressData && progressData.length > 0) {
          // Map progress data to steps
          const completed = steps.filter(step => 
            progressData.find(item => item.step === step.id && item.completed)
          );
          
          setCompletedSteps(completed);
          
          // Calculate progress percentage
          const progress = (completed.length / steps.length) * 100;
          setOnboardingProgress(progress);
          
          // Find the next incomplete step
          const next = steps.find(step => 
            !progressData.find(item => item.step === step.id && item.completed)
          );
          
          setNextStep(next || null);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    
    checkOnboardingStatus();
  }, [businessId]);
  
  const handleContinueSetup = () => {
    if (nextStep) {
      navigate(nextStep.url);
    } else {
      navigate('/onboarding/welcome');
    }
  };
  
  if (!showBanner) {
    return null;
  }
  
  return (
    <Card className="mb-6 border-blue-100">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <CardTitle className="text-blue-800">Complete a configuração do seu negócio</CardTitle>
        <CardDescription className="text-blue-600">
          {completedSteps.length === 0
            ? 'Vamos começar a configurar seu negócio para você aproveitar todos os recursos.'
            : `Você já completou ${completedSteps.length} de ${steps.length} etapas.`}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {steps.map((step) => {
              const isCompleted = completedSteps.some(s => s.id === step.id);
              return (
                <div
                  key={step.id}
                  className={`flex items-center p-3 rounded-md ${
                    isCompleted ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className="flex-1">{step.name}</div>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-gray-300 bg-white"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <Button 
          className="ml-auto" 
          onClick={handleContinueSetup}
        >
          {completedSteps.length === 0 ? 'Iniciar Configuração' : 'Continuar Configuração'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
