
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, MapPin } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { useFormValidation } from "@/hooks/useFormValidation";
import { 
  validateEmail, 
  validatePhone, 
  createRequiredValidator, 
  mockSaveFunction, 
  showSuccessToast, 
  showErrorToast 
} from "@/utils/formUtils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const BusinessProfileTab = () => {
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Gerais</h3>
            
            <FormField
              id="business-name"
              label="Nome do Negócio"
              value={getFieldValue("businessName")}
              onChange={(value) => updateField("businessName", value)}
              error={getFieldError("businessName")}
              touched={hasFieldBeenTouched("businessName")}
              required
            />
            
            <FormField
              id="business-email"
              label="Email de Contato"
              type="email"
              value={getFieldValue("businessEmail")}
              onChange={(value) => updateField("businessEmail", value)}
              error={getFieldError("businessEmail")}
              touched={hasFieldBeenTouched("businessEmail")}
              required
            />
            
            <FormField
              id="business-phone"
              label="Telefone"
              type="tel"
              value={getFieldValue("businessPhone")}
              onChange={(value) => updateField("businessPhone", value)}
              error={getFieldError("businessPhone")}
              touched={hasFieldBeenTouched("businessPhone")}
              required
            />
            
            <div className="space-y-2">
              <Label htmlFor="business-address">Endereço</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="business-address" 
                  type="text" 
                  value={getFieldValue("businessAddress")}
                  onChange={(e) => updateField("businessAddress", e.target.value)}
                  className="flex-1" 
                />
                <Button variant="outline" size="icon" type="button">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              {getFieldError("businessAddress") && hasFieldBeenTouched("businessAddress") && (
                <p className="text-sm font-medium text-destructive">{getFieldError("businessAddress")}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Logotipo e Imagens</h3>
            
            <div className="space-y-2">
              <Label htmlFor="business-logo">Logotipo</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <Button variant="outline" type="button">
                  <Upload className="h-4 w-4 mr-2" />
                  Alterar Logotipo
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-cover">Imagem de Capa</Label>
              <div className="flex items-center gap-4">
                <div className="w-48 h-24 rounded-md bg-gray-200 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <Button variant="outline" type="button">
                  <Upload className="h-4 w-4 mr-2" />
                  Alterar Imagem
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Redes Sociais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="facebook-link"
              label="Facebook"
              type="url"
              placeholder="https://www.facebook.com/seunegocio"
              value={getFieldValue("facebookLink")}
              onChange={(value) => updateField("facebookLink", value)}
              error={getFieldError("facebookLink")}
              touched={hasFieldBeenTouched("facebookLink")}
            />
            
            <FormField
              id="instagram-link"
              label="Instagram"
              type="url"
              placeholder="https://www.instagram.com/seunegocio"
              value={getFieldValue("instagramLink")}
              onChange={(value) => updateField("instagramLink", value)}
              error={getFieldError("instagramLink")}
              touched={hasFieldBeenTouched("instagramLink")}
            />
            
            <FormField
              id="linkedin-link"
              label="LinkedIn"
              type="url"
              placeholder="https://www.linkedin.com/company/seunegocio"
              value={getFieldValue("linkedinLink")}
              onChange={(value) => updateField("linkedinLink", value)}
              error={getFieldError("linkedinLink")}
              touched={hasFieldBeenTouched("linkedinLink")}
            />
            
            <FormField
              id="twitter-link"
              label="Twitter"
              type="url"
              placeholder="https://twitter.com/seunegocio"
              value={getFieldValue("twitterLink")}
              onChange={(value) => updateField("twitterLink", value)}
              error={getFieldError("twitterLink")}
              touched={hasFieldBeenTouched("twitterLink")}
            />
          </div>
        </div>
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
