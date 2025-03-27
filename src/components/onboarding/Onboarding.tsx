
import React, { useEffect } from "react";
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

export const Onboarding = () => {
  const { currentStep, loadProgress, saveProgress } = useOnboarding();

  // Carrega dados salvos quando o componente é montado
  useEffect(() => {
    loadProgress();
    // This effect should run only once when component mounts
  }, [loadProgress]);

  // Salva dados automaticamente quando steps são alterados
  useEffect(() => {
    // Avoid saving during initial render
    const timeoutId = setTimeout(() => {
      saveProgress();
    }, 500); // Increased timeout to reduce saving frequency

    return () => clearTimeout(timeoutId);
  }, [currentStep, saveProgress]);

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
          
          <OnboardingControls />
        </CardContent>
      </Card>
    </div>
  );
};
