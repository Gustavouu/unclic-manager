
import React from 'react';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingBannerProps {
  onDismiss: () => void;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({ onDismiss }) => {
  return (
    <div className="bg-primary/10 border-l-4 border-primary p-4 mb-6 relative">
      <button 
        onClick={onDismiss} 
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-primary/10"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Complete seu perfil</h3>
          <p className="text-sm text-muted-foreground">
            Configure seu negócio e comece a receber agendamentos!
          </p>
        </div>
        <Button 
          size="sm" 
          className="md:w-auto w-full"
          onClick={() => window.location.href = '/onboarding'}
        >
          Completar configuração
        </Button>
      </div>
    </div>
  );
};
