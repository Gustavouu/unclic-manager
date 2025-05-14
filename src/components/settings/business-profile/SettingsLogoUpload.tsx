
import React from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { ImageIcon } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";

export const SettingsLogoUpload: React.FC = () => {
  const { currentBusiness, updateBusinessSettings } = useTenant();
  
  const handleImageChange = (file: File, logoUrl: string) => {
    updateBusinessSettings({
      logo_url: logoUrl
    });
  };
  
  return (
    <div className="flex justify-center">
      <ImageUpload
        id="settings-logo-upload"
        imageUrl={currentBusiness?.settings?.logo_url || ""}
        onChange={(file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            handleImageChange(file, result);
          };
          reader.readAsDataURL(file);
        }}
        icon={<ImageIcon className="h-5 w-5" />}
        label="Logo"
        width="150px"
        height="150px"
      />
    </div>
  );
};
