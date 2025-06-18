
import React from "react";
import { ImageUploadFixed } from "@/components/ui/ImageUploadFixed";
import { ImageIcon } from "lucide-react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const LogoUploadFixed: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const handleImageChange = (logoUrl: string | null) => {
    updateBusinessData({
      logoUrl,
      logoData: logoUrl, // Keep for backward compatibility
      logo: null, // Clear file object since we now have URL
      logoName: logoUrl ? 'uploaded-logo' : undefined
    });
  };
  
  return (
    <div className="flex justify-center">
      <ImageUploadFixed
        id="logo-upload-fixed"
        imageUrl={businessData.logoUrl}
        onChange={handleImageChange}
        icon={<ImageIcon className="h-5 w-5" />}
        label="Logo"
        width="150px"
        height="150px"
      />
    </div>
  );
};
