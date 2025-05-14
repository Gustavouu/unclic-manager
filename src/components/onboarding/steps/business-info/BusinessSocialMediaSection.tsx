
import React from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Instagram, Facebook, Linkedin, Globe } from "lucide-react";

export const BusinessSocialMediaSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  // Initialize social media if it doesn't exist
  const socialMedia = businessData.socialMedia || {};
  
  const handleSocialMediaChange = (platform: string, value: string) => {
    updateBusinessData({
      socialMedia: {
        ...(businessData.socialMedia || {}),
        [platform]: value
      }
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presença Online</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">
              <Globe className="h-4 w-4 inline mr-2" />
              Website
            </Label>
            <Input
              id="website"
              placeholder="www.seusite.com.br"
              value={businessData.website || ""}
              onChange={(e) => updateBusinessData({ website: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instagram">
              <Instagram className="h-4 w-4 inline mr-2" />
              Instagram
            </Label>
            <Input
              id="instagram"
              placeholder="@seuinsta"
              value={socialMedia.instagram || ""}
              onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="facebook">
              <Facebook className="h-4 w-4 inline mr-2" />
              Facebook
            </Label>
            <Input
              id="facebook"
              placeholder="facebook.com/suapagina"
              value={socialMedia.facebook || ""}
              onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="linkedin">
              <Linkedin className="h-4 w-4 inline mr-2" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/suapagina"
              value={socialMedia.linkedin || ""}
              onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
