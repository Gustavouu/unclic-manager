
import React from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { FormField } from "@/components/ui/form-field";
import { validateEmail, validatePhone, formatPhone } from "@/utils/formUtils";

export const BusinessBasicInfoSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();

  const handleChange = (field: string, value: string) => {
    updateBusinessData({ [field]: value });
  };

  const handlePhoneChange = (value: string) => {
    // Aplica a máscara de formatação ao telefone
    const formattedPhone = formatPhone(value);
    updateBusinessData({ phone: formattedPhone });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Básicas</h3>
      
      <FormField
        id="business-name"
        label="Nome do Estabelecimento"
        value={businessData.name}
        onChange={(value) => handleChange("name", value)}
        error={!businessData.name && "O nome do estabelecimento é obrigatório"}
        touched={true}
        required
      />
      
      <FormField
        id="business-email"
        label="Email de Contato"
        type="email"
        value={businessData.email}
        onChange={(value) => handleChange("email", value)}
        error={validateEmail(businessData.email)}
        touched={true}
        required
      />
      
      <FormField
        id="business-phone"
        label="Telefone"
        type="tel"
        value={businessData.phone}
        onChange={handlePhoneChange}
        error={validatePhone(businessData.phone)}
        touched={true}
        required
      />
    </div>
  );
};
