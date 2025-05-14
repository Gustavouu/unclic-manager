
import React from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { CameraIcon } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";

export const SettingsBannerUpload: React.FC = () => {
  const { currentBusiness, updateBusinessSettings } = useTenant();
  
  const handleImageChange = (file: File, bannerUrl: string) => {
    updateBusinessSettings({
      banner_url: bannerUrl
    });
  };
  
  return (
    <div className="w-full">
      <ImageUpload
        id="settings-banner-upload"
        imageUrl={currentBusiness?.settings?.banner_url || ""}
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
