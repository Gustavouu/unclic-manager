
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { LogoImagesSection } from "./LogoImagesSection";
import { SocialMediaSection } from "./SocialMediaSection";
import { mockSaveFunction, showSuccessToast, showErrorToast } from "@/utils/formUtils";
import { useFormValidation } from "@/hooks/useFormValidation";
import { createRequiredValidator, validateEmail, validatePhone } from "@/utils/formUtils";

export const BusinessProfileCard = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    updateField,
    validateAllFields,
    getFieldValue,
    getFieldError,
    hasFieldBeenTouched,
    resetForm
  } = useFormValidation([
    { name: "businessName", value: "Salão de Beleza", validators: [createRequiredValidator("Nome do Negócio")] },
    { name: "businessEmail", value: "contato@salaodebeleza.com", validators: [createRequiredValidator("Email de Contato"), validateEmail] },
    { name: "businessPhone", value: "(11) 99999-9999", validators: [createRequiredValidator("Telefone"), validatePhone] },
    { name: "businessAddress", value: "Rua Exemplo, 123", validators: [createRequiredValidator("Endereço")] },
    { name: "facebookLink", value: "", validators: [] },
    { name: "instagramLink", value: "", validators: [] },
    { name: "linkedinLink", value: "", validators: [] },
    { name: "twitterLink", value: "", validators: [] },
  ]);

  const handleSave = async () => {
    const isValid = validateAllFields();
    
    if (!isValid) {
      showErrorToast("Por favor, corrija os erros antes de salvar.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const success = await mockSaveFunction();
      
      if (success) {
        showSuccessToast("Perfil do negócio atualizado com sucesso!");
      } else {
        showErrorToast();
      }
    } catch (error) {
      showErrorToast();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    showSuccessToast("Formulário restaurado ao estado inicial");
  };

  const formProps = {
    updateField,
    getFieldValue,
    getFieldError,
    hasFieldBeenTouched
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
