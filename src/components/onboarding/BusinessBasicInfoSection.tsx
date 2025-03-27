
import React, { useEffect } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { FormField } from "@/components/ui/form-field";
import { validateEmail, validatePhone, formatPhone } from "@/utils/formUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

export const BusinessBasicInfoSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();

  // Gera o URL do site baseado no nome do negócio quando o nome muda
  useEffect(() => {
    if (businessData.name && !businessData.website) {
      const formattedName = businessData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, ""); // Removidos os hifens
      
      updateBusinessData({ website: `${formattedName}.unclic.com.br` });
    }
  }, [businessData.name, businessData.website, updateBusinessData]);

  const handleChange = (field: string, value: string) => {
    updateBusinessData({ [field]: value });
  };

  const handlePhoneChange = (value: string) => {
    // Aplica a máscara de formatação ao telefone
    const formattedPhone = formatPhone(value);
    updateBusinessData({ phone: formattedPhone });
  };

  const handleWebsiteChange = (value: string) => {
    updateBusinessData({ website: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Básicas</h3>
      
      <FormField
        id="business-name"
        label="Nome do Estabelecimento"
        value={businessData.name || ""}
        onChange={(value) => handleChange("name", value)}
        error={!businessData.name && "O nome do estabelecimento é obrigatório"}
        touched={true}
        required
      />
      
      <FormField
        id="business-email"
        label="Email de Contato"
        type="email"
        value={businessData.email || ""}
        onChange={(value) => handleChange("email", value)}
        error={validateEmail(businessData.email)}
        touched={true}
        required
      />
      
      <FormField
        id="business-phone"
        label="Telefone"
        type="tel"
        value={businessData.phone || ""}
        onChange={handlePhoneChange}
        error={validatePhone(businessData.phone)}
        touched={true}
        required
      />
      
      <div className="space-y-2">
        <Label htmlFor="business-website" className="flex items-center gap-1.5">
          <Globe className="h-4 w-4" />
          Site do Estabelecimento
        </Label>
        <div className="flex items-center border rounded-md overflow-hidden">
          <span className="bg-muted text-muted-foreground px-3 py-2 text-sm border-r">
            https://
          </span>
          <Input 
            id="business-website" 
            type="text" 
            value={businessData.website || ""}
            onChange={(e) => handleWebsiteChange(e.target.value)}
            className="border-0" 
            placeholder="seunegocio.unclic.com.br"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Este é o endereço onde seus clientes poderão realizar agendamentos e pagamentos.
        </p>
      </div>
    </div>
  );
};
