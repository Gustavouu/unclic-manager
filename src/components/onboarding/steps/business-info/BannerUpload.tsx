
import React from "react";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Upload } from "lucide-react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const BannerUpload: React.FC = () => {
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
      <Label htmlFor="banner-upload">Banner do Estabelecimento</Label>
      
      <div className="mt-2">
        <ImageUpload
          id="banner-upload"
          imageUrl={businessData.bannerUrl || null}
          onImageChange={handleBannerChange}
          icon={<Upload className="w-8 h-8 text-muted-foreground mb-2" />}
          label="Clique para adicionar um banner"
          subLabel="Dimensões recomendadas: 1200x300px"
          width="w-full"
          height="h-40"
        />
      </div>
      
      <p className="text-xs text-muted-foreground mt-1">
        O banner será exibido na parte superior da página do seu estabelecimento
      </p>
    </div>
  );
};
