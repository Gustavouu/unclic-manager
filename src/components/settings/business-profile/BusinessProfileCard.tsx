
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { LogoImagesSection } from "./LogoImagesSection";
import { SocialMediaSection } from "./SocialMediaSection";
import { WebsiteSection } from "./WebsiteSection";
import { useBusinessProfileForm } from "@/hooks/useBusinessProfileForm";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { useEffect, useRef } from "react";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";

export const BusinessProfileCard = () => {
  const { isSaving, handleSave, handleCancel, formProps, loadBusinessData } = useBusinessProfileForm();
  const { loadProgress } = useOnboarding();
  const { businessData, refreshBusinessData } = useTenant();
  const initialized = useRef(false);

  // Load onboarding and business data when the component mounts - only once
  useEffect(() => {
    const initializeData = async () => {
      if (!initialized.current) {
        try {
          // First load onboarding progress data
          await loadProgress();
          
          // Then load actual business data from the tenant context
          if (businessData) {
            loadBusinessData(businessData);
          } else {
            // If no business data is available yet, try to refresh it
            await refreshBusinessData();
            initialized.current = true;
          }
        } catch (error) {
          console.error("Error loading business data:", error);
          toast.error("Erro ao carregar dados do negócio");
        }
        
        initialized.current = true;
      }
    };
    
    initializeData();
  }, [loadProgress, businessData, loadBusinessData, refreshBusinessData]);

  // Update form when business data changes
  useEffect(() => {
    if (businessData && initialized.current) {
      loadBusinessData(businessData);
    }
  }, [businessData, loadBusinessData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil do Negócio</CardTitle>
        <CardDescription>
          Informações básicas sobre o seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GeneralInfoSection {...formProps} />
          <LogoImagesSection />
        </div>
        
        <WebsiteSection {...formProps} />
        
        <SocialMediaSection {...formProps} />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel} type="button">Cancelar</Button>
        <Button onClick={handleSave} disabled={isSaving} type="button">
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </CardFooter>
    </Card>
  );
};
