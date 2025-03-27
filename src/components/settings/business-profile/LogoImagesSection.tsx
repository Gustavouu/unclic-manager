
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Image, Upload } from "lucide-react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const LogoImagesSection = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const handleLogoChange = (file: File | null, logoUrl: string | null, logoData?: string) => {
    updateBusinessData({ 
      logo: file,
      logoName: file ? file.name : undefined,
      logoUrl,
      logoData
    });
  };
  
  const handleBannerChange = (file: File | null, bannerUrl: string | null, bannerData?: string) => {
    updateBusinessData({ 
      banner: file,
      bannerName: file ? file.name : undefined,
      bannerUrl,
      bannerData
    });
  };
  
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div>
          <Label htmlFor="business-logo" className="mb-2 block">
            Logo
          </Label>
          
          <div className="flex items-center space-x-4">
            <ImageUpload
              id="business-logo"
              imageUrl={businessData.logoUrl || null}
              onImageChange={handleLogoChange}
              icon={<Image className="w-8 h-8 text-muted-foreground mb-2" />}
              label="Clique para adicionar"
              width="w-32"
              height="h-32"
            />
            
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
            <ImageUpload
              id="business-banner"
              imageUrl={businessData.bannerUrl || null}
              onImageChange={handleBannerChange}
              icon={<Upload className="w-8 h-8 text-muted-foreground mb-2" />}
              label="Clique para adicionar um banner"
              subLabel="Dimensões recomendadas: 1200x300px"
              width="w-full"
              height="h-40"
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
