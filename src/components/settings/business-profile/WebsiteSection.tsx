
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

interface WebsiteSectionProps {
  getFieldValue: (name: string) => string;
  getFieldError: (name: string) => string | null;
  updateField: (name: string, value: string) => void;
  hasFieldBeenTouched: (name: string) => boolean;
}

export const WebsiteSection = ({
  getFieldValue,
  getFieldError,
  updateField,
  hasFieldBeenTouched
}: WebsiteSectionProps) => {
  const { businessData } = useCurrentBusiness();
  const [slugValue, setSlugValue] = useState("");
  
  useEffect(() => {
    if (businessData) {
      setSlugValue(businessData.slug || "");
      
      // Buscar se existe um website associado ao negócio nas configurações
      const fetchWebsite = async () => {
        try {
          const { data: configData, error } = await supabase
            .from("configuracoes_negocio")
            .select("website_url")
            .eq("id_negocio", businessData.id)
            .single();
            
          if (!error && configData && configData.website_url) {
            updateField("businessWebsite", configData.website_url);
          }
        } catch (error) {
          console.error("Erro ao buscar website:", error);
        }
      };
      
      fetchWebsite();
    }
  }, [businessData]);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="text-lg font-medium">Website</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessSlug">Identificador Único (slug)</Label>
          <div className="flex items-center">
            <span className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l-md text-gray-600 text-sm">
              unclic.com.br/
            </span>
            <Input
              id="businessSlug"
              value={slugValue}
              disabled
              className="flex-grow rounded-l-none bg-gray-50"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Este identificador é usado para criar a URL da página do seu negócio.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessWebsite">Website Próprio</Label>
          <Input
            id="businessWebsite"
            placeholder="https://www.seusite.com.br"
            value={getFieldValue("businessWebsite")}
            onChange={(e) => updateField("businessWebsite", e.target.value)}
            className={getFieldError("businessWebsite") && hasFieldBeenTouched("businessWebsite") ? "border-red-500" : ""}
          />
          {getFieldError("businessWebsite") && hasFieldBeenTouched("businessWebsite") && (
            <p className="text-sm text-red-500">{getFieldError("businessWebsite")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
