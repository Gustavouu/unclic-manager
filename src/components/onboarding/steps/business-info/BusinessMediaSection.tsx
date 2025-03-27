
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { createFilePreview, revokeFilePreview, fileToBase64 } from "@/contexts/onboarding/utils";
import { Image, Upload } from "lucide-react";

export const BusinessMediaSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  // Initialize previews from businessData
  useEffect(() => {
    // Handle logo preview
    if (businessData.logo instanceof File) {
      const newLogoPreview = createFilePreview(businessData.logo);
      setLogoPreview(newLogoPreview);
    } else if (businessData.logoUrl) {
      setLogoPreview(businessData.logoUrl);
    }
    
    // Handle banner preview
    if (businessData.banner instanceof File) {
      const newBannerPreview = createFilePreview(businessData.banner);
      setBannerPreview(newBannerPreview);
    } else if (businessData.bannerUrl) {
      setBannerPreview(businessData.bannerUrl);
    }
  }, [businessData.logo, businessData.logoUrl, businessData.banner, businessData.bannerUrl]);
  
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Clean up old URL if exists
      if (logoPreview && logoPreview.startsWith('blob:')) {
        revokeFilePreview(logoPreview);
      }
      
      // Create a preview URL
      const newPreviewUrl = URL.createObjectURL(file);
      setLogoPreview(newPreviewUrl);
      
      // Convert to base64 for storage
      fileToBase64(file).then(base64Data => {
        updateBusinessData({ 
          logo: file,
          logoName: file.name,
          logoUrl: newPreviewUrl,
          logoData: base64Data
        });
      }).catch(err => {
        console.error("Error converting logo to base64:", err);
        // Still update with the file even if base64 conversion fails
        updateBusinessData({ 
          logo: file,
          logoName: file.name,
          logoUrl: newPreviewUrl
        });
      });
    }
  };
  
  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Clean up old URL if exists
      if (bannerPreview && bannerPreview.startsWith('blob:')) {
        revokeFilePreview(bannerPreview);
      }
      
      // Create a preview URL
      const newPreviewUrl = URL.createObjectURL(file);
      setBannerPreview(newPreviewUrl);
      
      // Convert to base64 for storage
      fileToBase64(file).then(base64Data => {
        updateBusinessData({ 
          banner: file,
          bannerName: file.name,
          bannerUrl: newPreviewUrl,
          bannerData: base64Data
        });
      }).catch(err => {
        console.error("Error converting banner to base64:", err);
        // Still update with the file even if base64 conversion fails
        updateBusinessData({ 
          banner: file,
          bannerName: file.name,
          bannerUrl: newPreviewUrl
        });
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Mídia</h3>
      
      <div className="space-y-4">
        {/* Logo Upload */}
        <div>
          <Label htmlFor="logo-upload">Logo do Estabelecimento</Label>
          
          <div className="mt-2">
            {logoPreview ? (
              <div className="relative w-32 h-32 rounded-md overflow-hidden border border-border">
                <img 
                  src={logoPreview} 
                  alt="Logo Preview" 
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => {
                    // Clean up URL if exists
                    if (logoPreview && logoPreview.startsWith('blob:')) {
                      revokeFilePreview(logoPreview);
                    }
                    
                    updateBusinessData({ 
                      logo: null,
                      logoName: undefined,
                      logoUrl: undefined,
                      logoData: undefined
                    });
                    
                    setLogoPreview(null);
                  }}
                >
                  ✕
                </Button>
              </div>
            ) : (
              <label 
                htmlFor="logo-upload" 
                className="flex items-center justify-center border border-dashed border-border rounded-md p-6 w-32 h-32 cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <Image className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground text-center">
                    Clique para adicionar
                  </span>
                </div>
              </label>
            )}
            
            <Input 
              id="logo-upload" 
              type="file" 
              accept="image/*"
              className="hidden" 
              onChange={handleLogoChange}
            />
          </div>
          
          <p className="text-xs text-muted-foreground mt-1">
            Formatos recomendados: PNG, JPG. Tamanho máximo: 2MB
          </p>
        </div>
        
        {/* Banner Upload */}
        <div>
          <Label htmlFor="banner-upload">Banner do Estabelecimento</Label>
          
          <div className="mt-2">
            {bannerPreview ? (
              <div className="relative w-full h-40 rounded-md overflow-hidden border border-border">
                <img 
                  src={bannerPreview} 
                  alt="Banner Preview" 
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => {
                    // Clean up URL if exists
                    if (bannerPreview && bannerPreview.startsWith('blob:')) {
                      revokeFilePreview(bannerPreview);
                    }
                    
                    updateBusinessData({ 
                      banner: null,
                      bannerName: undefined,
                      bannerUrl: undefined,
                      bannerData: undefined
                    });
                    
                    setBannerPreview(null);
                  }}
                >
                  ✕
                </Button>
              </div>
            ) : (
              <label 
                htmlFor="banner-upload" 
                className="flex items-center justify-center border border-dashed border-border rounded-md p-6 w-full h-40 cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Clique para adicionar um banner
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Dimensões recomendadas: 1200x300px
                  </span>
                </div>
              </label>
            )}
            
            <Input 
              id="banner-upload" 
              type="file" 
              accept="image/*"
              className="hidden" 
              onChange={handleBannerChange}
            />
          </div>
          
          <p className="text-xs text-muted-foreground mt-1">
            O banner será exibido na parte superior da página do seu estabelecimento
          </p>
        </div>
      </div>
    </div>
  );
};
