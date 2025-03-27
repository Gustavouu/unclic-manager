
import React from "react";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Image } from "lucide-react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const LogoUpload: React.FC = () => {
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
      <Label htmlFor="logo-upload">Logo do Estabelecimento</Label>
      
      <div className="mt-2">
        <ImageUpload
          id="logo-upload"
          imageUrl={businessData.logoUrl || null}
          onImageChange={handleLogoChange}
          icon={<Image className="w-8 h-8 text-muted-foreground mb-2" />}
          label="Clique para adicionar"
          width="w-32"
          height="h-32"
        />
      </div>
      
      <p className="text-xs text-muted-foreground mt-1">
        Formatos recomendados: PNG, JPG. Tamanho máximo: 2MB
      </p>
    </div>
  );
};
