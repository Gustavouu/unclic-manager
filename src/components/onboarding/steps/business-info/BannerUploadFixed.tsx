
import React from "react";
import { ImageUploadFixed } from "@/components/ui/ImageUploadFixed";
import { CameraIcon } from "lucide-react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const BannerUploadFixed: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const handleImageChange = (bannerUrl: string | null) => {
    updateBusinessData({
      bannerUrl: bannerUrl || "",
    });
  };
  
  return (
    <div className="w-full">
      <ImageUploadFixed
        id="banner-upload-fixed"
        imageUrl={businessData.bannerUrl}
        onChange={handleImageChange}
        icon={<CameraIcon className="h-5 w-5" />}
        label="Banner do estabelecimento"
        subLabel="Imagem que aparecerá no topo da página do seu negócio"
        width="100%"
        height="200px"
      />
    </div>
  );
};
