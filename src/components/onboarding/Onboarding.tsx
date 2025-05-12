
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
import { WelcomeScreen } from "./welcome/WelcomeScreen";
import { OnboardingProcessStatus } from "./status/OnboardingProcessStatus";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface OnboardingProps {
  hasExistingBusiness?: boolean;
  businessId?: string | null;
}

export const Onboarding: React.FC<OnboardingProps> = ({ hasExistingBusiness = false, businessId = null }) => {
  const { 
    currentStep, 
    loadProgress, 
    saveProgress, 
    onboardingMethod,
    status,
    error,
    isEditMode,
    loadExistingBusinessData,
    setIsEditMode
  } = useOnboarding();

  // Load data - either from localStorage or from database for existing business
  useEffect(() => {
    const initData = async () => {
      // Check if we're editing an existing business
      if (hasExistingBusiness && businessId) {
        // Try to load data from the database first
        await loadExistingBusinessData(businessId);
      } else {
        // Try to load from localStorage for new business creation
        loadProgress();
      }
    };
    
    const timer = setTimeout(() => {
      initData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [hasExistingBusiness, businessId, loadProgress, loadExistingBusinessData]);

  // Auto-save data when steps change
  useEffect(() => {
    // Avoid saving during initial render
    const timeoutId = setTimeout(() => {
      saveProgress();
    }, 500); // Increased timeout to reduce saving frequency

    return () => clearTimeout(timeoutId);
  }, [currentStep, saveProgress, onboardingMethod]);

  // Show welcome screen if no method is selected
  if (currentStep === -1 || onboardingMethod === null) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6">
            <WelcomeScreen isEditMode={hasExistingBusiness} />
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
        {isEditMode && (
          <div className="px-6 pt-6">
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Modo de Edição</AlertTitle>
              <AlertDescription>
                Você está editando as informações do seu negócio existente. As alterações serão salvas automaticamente.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <OnboardingHeader isEditMode={isEditMode} />
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
                <SummaryStep isEditMode={isEditMode} />
              </TabsContent>
            </Tabs>
          </div>
          
          <OnboardingControls isEditMode={isEditMode} />
        </CardContent>
      </Card>
    </div>
  );
};
