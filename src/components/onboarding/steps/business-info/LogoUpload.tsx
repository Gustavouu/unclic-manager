
import React from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { ImageIcon } from "lucide-react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const LogoUpload: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const handleImageChange = (file: File, logoUrl: string) => {
    updateBusinessData({
      logo: file,
      logoUrl,
      logoName: file.name,
      logoData: logoUrl
    });
  };
  
  return (
    <div className="flex justify-center">
      <ImageUpload
        id="logo-upload"
        imageUrl={businessData.logoUrl}
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
