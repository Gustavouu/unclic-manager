
import React, { useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const BusinessMediaSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (file: File) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 5MB");
      return;
    }
    
    try {
      setUploading(true);
      
      // Convert to base64 for storage in onboarding context
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBusinessData({
          logo: file,
          logoUrl: reader.result as string,
          logoName: file.name
        });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erro ao fazer upload da logo:", error);
      toast.error("Erro ao fazer upload da logo");
      setUploading(false);
    }
  };

  const handleBannerUpload = async (file: File) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 5MB");
      return;
    }
    
    try {
      setUploading(true);
      
      // Convert to base64 for storage in onboarding context
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBusinessData({
          banner: file,
          bannerUrl: reader.result as string,
          bannerName: file.name
        });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erro ao fazer upload do banner:", error);
      toast.error("Erro ao fazer upload do banner");
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mídias e Redes Sociais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Logo</Label>
          <ImageUpload
            value={businessData.logoUrl}
            onChange={handleLogoUpload}
            disabled={uploading}
            maxSize={5}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Banner</Label>
          <ImageUpload
            value={businessData.bannerUrl}
            onChange={handleBannerUpload}
            disabled={uploading}
            maxSize={5}
            aspectRatio="16:9"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            placeholder="Ex: https://www.seusite.com"
            value={businessData.website || ""}
            onChange={(e) => updateBusinessData({ website: e.target.value })}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              placeholder="Ex: @seunegocio"
              value={businessData.socialMedia?.instagram || ""}
              onChange={(e) => updateBusinessData({ 
                socialMedia: { 
                  ...businessData.socialMedia,
                  instagram: e.target.value 
                } 
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              placeholder="Ex: facebook.com/seunegocio"
              value={businessData.socialMedia?.facebook || ""}
              onChange={(e) => updateBusinessData({ 
                socialMedia: { 
                  ...businessData.socialMedia,
                  facebook: e.target.value 
                } 
              })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
