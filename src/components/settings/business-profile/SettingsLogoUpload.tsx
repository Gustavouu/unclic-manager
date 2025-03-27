
import React from "react";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Image } from "lucide-react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const SettingsLogoUpload: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const handleLogoChange = (file: File | null, logoUrl: string | null, logoData?: string) => {
    updateBusinessData({ 
      logo: file,
      logoName: file ? file.name : undefined,
      logoUrl,
      logoData
    });
  };
  
  return (
    <div>
      <Label htmlFor="business-logo" className="mb-2 block">
        Logo
      </Label>
      
      <div className="flex items-center space-x-4">
        <ImageUpload
          id="business-logo"
          imageUrl={businessData.logoUrl || null}
          onImageChange={handleLogoChange}
          icon={<Image className="w-8 h-8 text-muted-foreground mb-2" />}
          label="Clique para adicionar"
          width="w-32"
          height="h-32"
        />
        
        <div className="flex-1">
          <h4 className="text-sm font-medium">Logo do Negócio</h4>
          <p className="text-sm text-muted-foreground">
            Carregue uma imagem quadrada para usar como logo do seu negócio.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG ou PNG. Tamanho máximo de 1MB.
          </p>
        </div>
      </div>
    </div>
  );
};
