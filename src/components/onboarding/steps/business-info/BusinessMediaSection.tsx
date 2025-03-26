
import React from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";

export const BusinessMediaSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();

  const handleFileChange = (field: 'logo' | 'banner', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateBusinessData({ [field]: e.target.files[0] });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Logotipo e Banner</h3>
      
      <div className="space-y-2">
        <Label htmlFor="business-logo">Logotipo</Label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {businessData.logo ? (
              <img 
                src={URL.createObjectURL(businessData.logo)} 
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
            {businessData.banner ? (
              <img 
                src={URL.createObjectURL(businessData.banner)} 
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
