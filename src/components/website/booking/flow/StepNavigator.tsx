
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { StepNavigatorProps } from "../types";

export function StepNavigator({ step, onPrevious }: StepNavigatorProps) {
  if (step === 0) return null;
  
  return (
    <Button 
      variant="ghost" 
      onClick={onPrevious}
      className="flex items-center gap-2 text-muted-foreground absolute left-6 top-6"
      type="button"
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar
    </Button>
  );
}
