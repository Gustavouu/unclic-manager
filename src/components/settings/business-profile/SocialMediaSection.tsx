
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

interface SocialMediaSectionProps {
  getFieldValue: (name: string) => string;
  getFieldError: (name: string) => string | null;
  updateField: (name: string, value: string) => void;
  hasFieldBeenTouched: (name: string) => boolean;
}

export const SocialMediaSection = ({
  getFieldValue,
  getFieldError,
  updateField,
  hasFieldBeenTouched
}: SocialMediaSectionProps) => {
  const { businessId } = useCurrentBusiness();
  
  useEffect(() => {
    if (!businessId) return;
    
    // Buscar redes sociais do negócio
    const fetchSocialMedia = async () => {
      try {
        const { data, error } = await supabase
          .from("configuracoes_negocio")
          .select("redes_sociais")
          .eq("id_negocio", businessId)
          .single();
          
        if (error) {
          console.error("Erro ao buscar redes sociais:", error);
          return;
        }
        
        if (data && data.redes_sociais) {
          const socialMedia = data.redes_sociais;
          updateField("facebookLink", socialMedia.facebook || "");
          updateField("instagramLink", socialMedia.instagram || "");
          updateField("linkedinLink", socialMedia.linkedin || "");
          updateField("twitterLink", socialMedia.twitter || "");
        }
      } catch (error) {
        console.error("Erro ao buscar redes sociais:", error);
      }
    };
    
    fetchSocialMedia();
  }, [businessId]);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="text-lg font-medium">Redes Sociais</h3>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="facebookLink">Facebook</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Facebook size={16} className="text-gray-400" />
            </div>
            <FormControl>
              <Input
                id="facebookLink"
                placeholder="https://facebook.com/seunegocio"
                className="pl-10"
                value={getFieldValue("facebookLink")}
                onChange={(e) => updateField("facebookLink", e.target.value)}
              />
            </FormControl>
          </div>
          {getFieldError("facebookLink") && hasFieldBeenTouched("facebookLink") && (
            <p className="text-sm text-red-500">{getFieldError("facebookLink")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagramLink">Instagram</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Instagram size={16} className="text-gray-400" />
            </div>
            <FormControl>
              <Input
                id="instagramLink"
                placeholder="@seuinstagram"
                className="pl-10"
                value={getFieldValue("instagramLink")}
                onChange={(e) => updateField("instagramLink", e.target.value)}
              />
            </FormControl>
          </div>
          {getFieldError("instagramLink") && hasFieldBeenTouched("instagramLink") && (
            <p className="text-sm text-red-500">{getFieldError("instagramLink")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedinLink">LinkedIn</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Linkedin size={16} className="text-gray-400" />
            </div>
            <FormControl>
              <Input
                id="linkedinLink"
                placeholder="https://linkedin.com/company/seunegocio"
                className="pl-10"
                value={getFieldValue("linkedinLink")}
                onChange={(e) => updateField("linkedinLink", e.target.value)}
              />
            </FormControl>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitterLink">Twitter</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Twitter size={16} className="text-gray-400" />
            </div>
            <FormControl>
              <Input
                id="twitterLink"
                placeholder="@seutwitter"
                className="pl-10"
                value={getFieldValue("twitterLink")}
                onChange={(e) => updateField("twitterLink", e.target.value)}
              />
            </FormControl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
