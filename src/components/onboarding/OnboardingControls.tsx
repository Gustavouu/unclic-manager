
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOnboarding } from '@/contexts/onboarding/OnboardingContext';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface OnboardingControlsProps {
  currentStep: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const OnboardingControls: React.FC<OnboardingControlsProps> = ({
  currentStep,
  onNext,
  onPrevious,
}) => {
  const { businessData, businessHours, completeOnboarding } = useOnboarding();
  
  const handleComplete = async () => {
    try {
      await completeOnboarding();
      console.log('Onboarding completed successfully');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const isLastStep = currentStep === '4';
  const isFirstStep = currentStep === '0';

  // Check if business hours are properly configured
  const hasValidBusinessHours = businessHours && Object.values(businessHours).some(day => {
    return day.isOpen === true || day.open === true;
  });

  const canProceed = () => {
    switch (currentStep) {
      case '0':
        return businessData.name && businessData.name.length > 0;
      case '3':
        return hasValidBusinessHours;
      default:
        return true;
    }
  };

  return (
    <Card className="mt-8">
      <CardContent className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!onPrevious}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLastStep ? (
            <Button
              onClick={handleComplete}
              disabled={!canProceed()}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Finalizar Configuração
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={!onNext || !canProceed()}
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
