
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { LogoImagesSection } from "./LogoImagesSection";
import { SocialMediaSection } from "./SocialMediaSection";
import { useBusinessProfileForm } from "@/hooks/useBusinessProfileForm";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { useEffect, useRef } from "react";

export const BusinessProfileCard = () => {
  const { isSaving, handleSave, handleCancel, formProps } = useBusinessProfileForm();
  const { loadProgress } = useOnboarding();
  const initialized = useRef(false);

  // Load onboarding data when the component mounts - only once
  useEffect(() => {
    if (!initialized.current) {
      loadProgress();
      initialized.current = true;
    }
  }, []); // Remove loadProgress from dependency array to prevent infinite loops

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
