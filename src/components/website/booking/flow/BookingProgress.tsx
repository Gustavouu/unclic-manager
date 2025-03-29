
import React from "react";
import { BookingProgressProps } from "../types";

export function BookingProgress({ currentStep, getStepTitle }: BookingProgressProps) {
  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-6">
      {currentStep > 0 && (
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-6">
          <div 
            className="bg-primary h-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center">
        {currentStep > 0 ? (
          <div></div> // Empty div to maintain layout (previous button is added by StepNavigator)
        ) : (
          <div></div> // Empty div to maintain layout
        )}
        
        <h2 className="text-xl font-bold text-center">
          {getStepTitle ? getStepTitle() : ""}
        </h2>
        
        <span className="text-sm text-muted-foreground">
          {currentStep > 0 ? `Passo ${currentStep} de 5` : ""}
        </span>
      </div>
    </div>
  );
}
