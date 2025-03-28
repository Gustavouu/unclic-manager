
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface StepNavigatorProps {
  step: number;
  prevStep: () => void;
}

export function StepNavigator({ step, prevStep }: StepNavigatorProps) {
  if (step === 0) return null;
  
  return (
    <Button 
      variant="ghost" 
      onClick={prevStep}
      className="flex items-center gap-2 text-muted-foreground absolute left-6 top-6"
      type="button"
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar
    </Button>
  );
}
