
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Info } from 'lucide-react';

interface OnboardingBannerProps {
  onDismiss: () => void;
}

export function OnboardingBanner({ onDismiss }: OnboardingBannerProps) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <Info className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between md:items-center">
          <p className="text-sm text-blue-700">
            Bem-vindo ao Unclic! Complete a configuração inicial do seu negócio para aproveitar todos os recursos.
          </p>
          <div className="mt-3 text-sm md:mt-0 md:ml-6">
            <Button 
              variant="outline" 
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
              onClick={onDismiss}
            >
              Entendi
            </Button>
            <Button 
              variant="default"
              className="ml-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = '/settings'}
            >
              Configurar <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
