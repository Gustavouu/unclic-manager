
import { useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { FormField } from "@/components/ui/form-field";
import { ImageUpload } from "@/components/ui/image-upload";
import { Separator } from "@/components/ui/separator";

export const BusinessMediaSection = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  const handleLogoUpload = (file: File) => {
    if (file) {
      setLogoUploading(true);
      const logoUrl = URL.createObjectURL(file);
      updateBusinessData({
        logo: file,
        logoUrl,
        logoName: file.name
      });
      setLogoUploading(false);
    }
  };

  const handleBannerUpload = (file: File) => {
    if (file) {
      setBannerUploading(true);
      const bannerUrl = URL.createObjectURL(file);
      updateBusinessData({
        banner: file,
        bannerUrl,
        bannerName: file.name
      });
      setBannerUploading(false);
    }
  };

  const handleWebsiteChange = (value: string) => {
    updateBusinessData({ website: value });
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    updateBusinessData({
      socialMedia: {
        ...businessData.socialMedia,
        [platform]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Mídia & Social</h3>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <div className="mb-2">Logo</div>
          <ImageUpload
            value={businessData.logoUrl}
            onChange={handleLogoUpload}
            loading={logoUploading}
            className="h-40 w-full"
          />
        </div>
        
        <div className="w-full sm:w-1/2">
          <div className="mb-2">Banner</div>
          <ImageUpload
            value={businessData.bannerUrl}
            onChange={handleBannerUpload}
            loading={bannerUploading}
            className="h-40 w-full aspect-[2/1]"
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <FormField
          id="business-website"
          label="Website (opcional)"
          value={businessData.website || ""}
          onChange={handleWebsiteChange}
          placeholder="https://www.seusite.com.br"
        />
        
        <FormField
          id="business-instagram"
          label="Instagram (opcional)"
          value={businessData.socialMedia?.instagram || ""}
          onChange={(value) => handleSocialMediaChange("instagram", value)}
          placeholder="@seuinstagram"
          startIcon="instagram"
        />
        
        <FormField
          id="business-facebook"
          label="Facebook (opcional)"
          value={businessData.socialMedia?.facebook || ""}
          onChange={(value) => handleSocialMediaChange("facebook", value)}
          placeholder="facebook.com/seunegocio"
          startIcon="facebook"
        />
      </div>
    </div>
  );
};
