
import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { OnboardingSteps } from "./OnboardingSteps";
import { BusinessInfoStep } from "./steps/business-info";
import { ServicesStep } from "./steps/ServicesStep";
import { StaffStep } from "./steps/StaffStep";
import { HoursStep } from "./steps/HoursStep";
import { SummaryStep } from "./steps/SummaryStep";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingControls } from "./OnboardingControls";
import { WelcomeScreen } from "./welcome/WelcomeScreen";
import { OnboardingProcessStatus } from "./status/OnboardingProcessStatus";

export const Onboarding = () => {
  const { 
    currentStep, 
    loadProgress, 
    saveProgress, 
    onboardingMethod,
    status,
    error,
    setCurrentStep
  } = useOnboarding();

  const totalSteps = 5; // 0 a 4
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(0);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Load saved data when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProgress();
    }, 100);
    return () => clearTimeout(timer);
  }, [loadProgress]);

  // Optimized auto-save with debouncing and rate limiting
  useEffect(() => {
    // Don't save during initial render or if method is null
    if (currentStep === -1 || onboardingMethod === null) return;
    
    // Rate limiting: only save once every 2 seconds
    const now = Date.now();
    if (now - lastSaveRef.current < 2000) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout with longer delay
    saveTimeoutRef.current = setTimeout(() => {
      try {
        saveProgress();
        lastSaveRef.current = Date.now();
      } catch (error) {
        console.error('Error in auto-save:', error);
      }
    }, 1000); // Increased from 500ms to 1000ms

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentStep, saveProgress, onboardingMethod]);

  // Show welcome screen if no method is selected
  if (currentStep === -1 || onboardingMethod === null) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6">
            <WelcomeScreen />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show status screen when processing
  if (status === "processing" || status === "verifying" || status === "saving") {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6">
            <OnboardingProcessStatus />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <Card>
        <OnboardingHeader />
        <CardContent className="p-6">
          <OnboardingSteps />
          
          <div className="mt-8">
            <Tabs value={currentStep.toString()} className="w-full">
              <TabsContent value="0" className="mt-0">
                <BusinessInfoStep />
              </TabsContent>
              
              <TabsContent value="1" className="mt-0">
                <ServicesStep />
              </TabsContent>
              
              <TabsContent value="2" className="mt-0">
                <StaffStep />
              </TabsContent>
              
              <TabsContent value="3" className="mt-0">
                <HoursStep />
              </TabsContent>
              
              <TabsContent value="4" className="mt-0">
                <SummaryStep />
              </TabsContent>
            </Tabs>
          </div>
          
          <OnboardingControls 
            currentStep={currentStep.toString()}
            onNext={currentStep < totalSteps - 1 ? handleNext : undefined}
            onPrevious={currentStep > 0 ? handlePrevious : undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};
