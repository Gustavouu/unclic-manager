
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Upload } from "lucide-react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { createFilePreview, revokeFilePreview } from "@/contexts/onboarding/utils";

export const LogoImagesSection = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  // Create previews when file objects change
  useEffect(() => {
    // Handle logo preview
    if (businessData.logo instanceof File) {
      const newLogoPreview = createFilePreview(businessData.logo);
      setLogoPreview(newLogoPreview);
      
      // Clean up previous preview
      return () => {
        if (newLogoPreview) revokeFilePreview(newLogoPreview);
      };
    }
  }, [businessData.logo]);
  
  // Create preview for banner
  useEffect(() => {
    // Handle banner preview
    if (businessData.banner instanceof File) {
      const newBannerPreview = createFilePreview(businessData.banner);
      setBannerPreview(newBannerPreview);
      
      // Clean up previous preview
      return () => {
        if (newBannerPreview) revokeFilePreview(newBannerPreview);
      };
    }
  }, [businessData.banner]);
  
  // Clean up all previews on unmount
  useEffect(() => {
    return () => {
      if (logoPreview) revokeFilePreview(logoPreview);
      if (bannerPreview) revokeFilePreview(bannerPreview);
    };
  }, [logoPreview, bannerPreview]);
  
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateBusinessData({ logo: file });
  };
  
  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateBusinessData({ banner: file });
  };
  
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div>
          <Label htmlFor="business-logo" className="mb-2 block">
            Logo
          </Label>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              {logoPreview ? (
                <div className="w-32 h-32 rounded-md overflow-hidden border border-border">
                  <img
                    src={logoPreview}
                    alt="Logo do negócio"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    onClick={() => {
                      updateBusinessData({ logo: null });
                      revokeFilePreview(logoPreview);
                      setLogoPreview(null);
                    }}
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center border border-dashed border-border rounded-md p-6 w-32 h-32">
                  <Label
                    htmlFor="business-logo"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Image className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground text-center">
                      Clique para adicionar
                    </span>
                  </Label>
                </div>
              )}
              <Input
                id="business-logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
            
            <div className="flex-1">
              <h4 className="text-sm font-medium">Logo do Negócio</h4>
              <p className="text-sm text-muted-foreground">
                Carregue uma imagem quadrada para usar como logo do seu negócio.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG ou PNG. Tamanho máximo de 1MB.
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="business-banner" className="mb-2 block">
            Banner
          </Label>
          
          <div className="flex flex-col space-y-2">
            {bannerPreview ? (
              <div className="relative w-full h-40 rounded-md overflow-hidden border border-border">
                <img
                  src={bannerPreview}
                  alt="Banner do negócio"
                  className="w-full h-full object-cover"
                />
                <Button
                  onClick={() => {
                    updateBusinessData({ banner: null });
                    revokeFilePreview(bannerPreview);
                    setBannerPreview(null);
                  }}
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                >
                  ✕
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center border border-dashed border-border rounded-md p-6 w-full h-40">
                <Label
                  htmlFor="business-banner"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Clique para adicionar um banner
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Dimensões recomendadas: 1200x300px
                  </span>
                </Label>
              </div>
            )}
            <Input
              id="business-banner"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerChange}
            />
            
            <p className="text-xs text-muted-foreground">
              Este banner será exibido no topo do perfil do seu negócio.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
