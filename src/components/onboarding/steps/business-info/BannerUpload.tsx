
import React from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { CameraIcon } from "lucide-react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const BannerUpload: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const handleImageChange = (file: File, bannerUrl: string) => {
    updateBusinessData({
      banner: file,
      bannerUrl,
      bannerName: file.name,
      bannerData: bannerUrl
    });
  };
  
  return (
    <div className="w-full">
      <ImageUpload
        id="banner-upload"
        imageUrl={businessData.bannerUrl}
        onChange={(file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            handleImageChange(file, result);
          };
          reader.readAsDataURL(file);
        }}
        icon={<CameraIcon className="h-5 w-5" />}
        label="Banner do estabelecimento"
        subLabel="Imagem que aparecerá no topo da página do seu negócio"
        width="100%"
        height="200px"
      />
    </div>
  );
};
