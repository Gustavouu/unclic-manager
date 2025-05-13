
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { LogoImagesSection } from "./LogoImagesSection";
import { SocialMediaSection } from "./SocialMediaSection";
import { WebsiteSection } from "./WebsiteSection";
import { useBusinessProfileForm } from "@/hooks/useBusinessProfileForm";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { toast } from "sonner";

export const BusinessProfileCard = () => {
  const { businessId, businessData, fetchBusinessData } = useCurrentBusiness();
  const [isSaving, setIsSaving] = useState(false);
  const { handleCancel, formProps } = useBusinessProfileForm();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      fetchBusinessData(true);
      initialized.current = true;
    }
  }, [fetchBusinessData]);

  const handleSave = async () => {
    if (!businessId) {
      toast.error("Erro ao salvar: ID do negócio não encontrado");
      return;
    }

    setIsSaving(true);
    
    try {
      // Obter os valores do formulário
      const businessName = formProps.getFieldValue("businessName");
      const businessEmail = formProps.getFieldValue("businessEmail");
      const businessPhone = formProps.getFieldValue("businessPhone");
      const businessAddress = formProps.getFieldValue("businessAddress");
      const businessWebsite = formProps.getFieldValue("businessWebsite");
      
      // Validar dados obrigatórios
      if (!businessName || !businessEmail || !businessPhone) {
        toast.error("Preencha todos os campos obrigatórios");
        setIsSaving(false);
        return;
      }
      
      // Preparar dados de redes sociais
      const socialMedia = {
        facebook: formProps.getFieldValue("facebookLink"),
        instagram: formProps.getFieldValue("instagramLink"),
        linkedin: formProps.getFieldValue("linkedinLink"),
        twitter: formProps.getFieldValue("twitterLink")
      };
      
      // Atualizar os dados do negócio no Supabase
      const { error } = await supabase
        .from("negocios")
        .update({
          nome: businessName,
          email_admin: businessEmail,
          telefone: businessPhone,
          endereco: businessAddress,
          atualizado_em: new Date()
        })
        .eq("id", businessId);
        
      if (error) {
        console.error("Erro ao atualizar negócio:", error);
        toast.error("Erro ao salvar alterações");
        return;
      }
      
      // Atualizar configurações adicionais
      const { error: configError } = await supabase
        .from("configuracoes_negocio")
        .update({
          website_url: businessWebsite,
          social_media: socialMedia,
          atualizado_em: new Date()
        })
        .eq("id_negocio", businessId);
        
      if (configError) {
        console.error("Erro ao atualizar configurações:", configError);
        toast.error("Erro ao salvar configurações adicionais");
        return;
      }
      
      toast.success("Perfil atualizado com sucesso");
      
      // Recarregar dados do negócio
      fetchBusinessData(true);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error("Ocorreu um erro ao salvar o perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil do Negócio</CardTitle>
        <CardDescription>
          Informações básicas sobre o seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GeneralInfoSection {...formProps} />
          <LogoImagesSection />
        </div>
        
        <WebsiteSection {...formProps} />
        
        <SocialMediaSection {...formProps} />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel} type="button">Cancelar</Button>
        <Button onClick={handleSave} disabled={isSaving} type="button">
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </CardFooter>
    </Card>
  );
};
