
import React from "react";

interface BookingProgressProps {
  step: number;
  getStepTitle: () => string;
}

export function BookingProgress({ step, getStepTitle }: BookingProgressProps) {
  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;
  
  return (
    <div className="mb-6">
      {step > 0 && (
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-6">
          <div 
            className="bg-primary h-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center">
        {step > 0 ? (
          <div></div> // Empty div to maintain layout (previous button is added by StepNavigator)
        ) : (
          <div></div> // Empty div to maintain layout
        )}
        
        <h2 className="text-xl font-bold text-center">
          {getStepTitle()}
        </h2>
        
        <span className="text-sm text-muted-foreground">
          {step > 0 ? `Passo ${step} de 5` : ""}
        </span>
      </div>
    </div>
  );
}
