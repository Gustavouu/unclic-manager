
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
      <h3 className="text-lg font-medium">Logotipo e Banner</h3>
      
      <div className="space-y-2">
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
              <Upload className="h-6 w-6 text-gray-500" />
            )}
          </div>
          <div>
            <Button variant="outline" type="button" className="relative overflow-hidden">
              <Upload className="h-4 w-4 mr-2" />
              Adicionar Logotipo
              <input
                type="file"
                id="business-logo"
                accept="image/*"
                onChange={(e) => handleFileChange('logo', e)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Recomendado: 400x400px, JPG ou PNG
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
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
              <Image className="h-6 w-6 text-gray-500" />
            )}
          </div>
          <div>
            <Button variant="outline" type="button" className="relative overflow-hidden">
              <Upload className="h-4 w-4 mr-2" />
              Adicionar Banner
              <input
                type="file"
                id="business-banner"
                accept="image/*"
                onChange={(e) => handleFileChange('banner', e)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Recomendado: 1200x400px, JPG ou PNG
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
