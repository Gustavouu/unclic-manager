
import React, { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";
import { toast } from "sonner";

export const BusinessMediaSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  // Create preview URLs for existing files
  useEffect(() => {
    if (businessData.logo instanceof File) {
      setLogoPreview(URL.createObjectURL(businessData.logo));
    }
    
    if (businessData.banner instanceof File) {
      setBannerPreview(URL.createObjectURL(businessData.banner));
    }
    
    // Cleanup URLs on unmount
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [businessData.logo, businessData.banner]);

  const handleFileChange = (field: 'logo' | 'banner', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Update the file in businessData
      updateBusinessData({ [field]: file });
      
      // Create and set preview URL
      if (field === 'logo') {
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        if (bannerPreview) URL.revokeObjectURL(bannerPreview);
        setBannerPreview(URL.createObjectURL(file));
      }
      
      toast.success(`${field === 'logo' ? 'Logotipo' : 'Banner'} selecionado com sucesso!`);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Mídia</h3>
      
      <div className="space-y-4">
        <Label htmlFor="business-logo">Logotipo</Label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {logoPreview ? (
              <img 
                src={logoPreview}
                alt="Logo Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Image className="h-10 w-10 text-gray-400" />
            )}
          </div>
          
          <div>
            <Button variant="outline" asChild className="cursor-pointer">
              <label className="cursor-pointer">
                <input 
                  type="file"
                  id="business-logo"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileChange('logo', e)}
                />
                <Upload className="mr-2 h-4 w-4" />
                Selecionar Logotipo
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Recomendamos imagens quadradas com pelo menos 200×200px
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="business-banner">Banner</Label>
        <div className="flex items-center gap-4">
          <div className="w-48 h-24 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
            {bannerPreview ? (
              <img 
                src={bannerPreview}
                alt="Banner Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Image className="h-10 w-10 text-gray-400" />
            )}
          </div>
          
          <div>
            <Button variant="outline" asChild className="cursor-pointer">
              <label className="cursor-pointer">
                <input 
                  type="file"
                  id="business-banner"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileChange('banner', e)}
                />
                <Upload className="mr-2 h-4 w-4" />
                Selecionar Banner
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Recomendamos imagens no formato 1200×630px
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
