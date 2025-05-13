
import React, { useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { FormField } from "@/components/ui/form-field";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Image, Upload } from "lucide-react";

export const BusinessMediaSection = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const handleLogoChange = (file: File | null, logoUrl: string | null) => {
    updateBusinessData({ 
      logo: file,
      logoName: file ? file.name : null,
      logoUrl: logoUrl
    });
  };
  
  const handleBannerChange = (file: File | null, bannerUrl: string | null) => {
    updateBusinessData({ 
      banner: file,
      bannerName: file ? file.name : null,
      bannerUrl: bannerUrl
    });
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
        <div className="w-full sm:w-1/2">
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
        />
        
        <FormField
          id="business-facebook"
          label="Facebook (opcional)"
          value={businessData.socialMedia?.facebook || ""}
          onChange={(value) => handleSocialMediaChange("facebook", value)}
          placeholder="facebook.com/seunegocio"
        />
      </div>
    </div>
  );
};
