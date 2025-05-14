
import React from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

export const BusinessMediaSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('social-')) {
      const socialNetwork = name.replace('social-', '');
      updateBusinessData({ 
        socialMedia: { 
          ...businessData.socialMedia,
          [socialNetwork]: value 
        } 
      });
    } else {
      updateBusinessData({ [name]: value });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ImageIcon className="h-5 w-5" /> 
          Mídia e Redes Sociais
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logo_url">URL do Logo</Label>
          <Input 
            id="logo_url"
            name="logo_url"
            type="url"
            value={businessData.logo_url || ''}
            onChange={handleChange}
            placeholder="https://example.com/seu-logo.png"
          />
          <p className="text-xs text-muted-foreground">
            URL da imagem do seu logotipo
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="social-instagram">Instagram</Label>
          <div className="flex items-center space-x-2">
            <Instagram className="h-4 w-4 text-muted-foreground" />
            <Input 
              id="social-instagram"
              name="social-instagram"
              value={businessData.socialMedia?.instagram || ''}
              onChange={handleChange}
              placeholder="@seunegocio ou URL completa"
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="social-facebook">Facebook</Label>
          <div className="flex items-center space-x-2">
            <Facebook className="h-4 w-4 text-muted-foreground" />
            <Input 
              id="social-facebook"
              name="social-facebook"
              value={businessData.socialMedia?.facebook || ''}
              onChange={handleChange}
              placeholder="URL da sua página"
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="social-linkedin">LinkedIn</Label>
            <div className="flex items-center space-x-2">
              <Linkedin className="h-4 w-4 text-muted-foreground" />
              <Input 
                id="social-linkedin"
                name="social-linkedin"
                value={businessData.socialMedia?.linkedin || ''}
                onChange={handleChange}
                placeholder="URL"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="social-twitter">Twitter</Label>
            <div className="flex items-center space-x-2">
              <Twitter className="h-4 w-4 text-muted-foreground" />
              <Input 
                id="social-twitter"
                name="social-twitter"
                value={businessData.socialMedia?.twitter || ''}
                onChange={handleChange}
                placeholder="@usuario ou URL"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
