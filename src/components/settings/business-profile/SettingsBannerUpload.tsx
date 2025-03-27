
import React from "react";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Upload } from "lucide-react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const SettingsBannerUpload: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const handleBannerChange = (file: File | null, bannerUrl: string | null) => {
    // Only update if values have changed
    if (file !== businessData.banner || bannerUrl !== businessData.bannerUrl) {
      updateBusinessData({ 
        banner: file,
        bannerName: file ? file.name : null,
        bannerUrl: bannerUrl
      });
    }
  };
  
  return (
    <div>
      <Label htmlFor="business-banner" className="mb-2 block">
        Banner
      </Label>
      
      <div className="flex flex-col space-y-2">
        <ImageUpload
          id="business-banner"
          imageUrl={businessData.bannerUrl || null}
          onImageChange={handleBannerChange}
          icon={<Upload className="w-8 h-8 text-muted-foreground mb-2" />}
          label="Clique para adicionar um banner"
          subLabel="Dimensões recomendadas: 1200x300px"
          width="w-full"
          height="h-40"
        />
        
        <p className="text-xs text-muted-foreground">
          Este banner será exibido no topo do perfil do seu negócio.
        </p>
      </div>
    </div>
  );
};
