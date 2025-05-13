
import React from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { FormField } from "@/components/ui/form-field";

export const BusinessAddressSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();

  const handleChange = (field: string, value: string) => {
    updateBusinessData({ [field]: value });
  };

  const handleCepBlur = async () => {
    const cep = businessData.cep?.replace(/\D/g, '');
    
    if (cep?.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          updateBusinessData({
            address: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          });
        }
      } catch (error) {
        console.error("Error fetching address from CEP:", error);
      }
    }
  };

  const handleCepChange = (value: string) => {
    // Apply CEP formatting
    const formatted = value
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
    
    updateBusinessData({ cep: formatted });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Endereço</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="business-cep"
          label="CEP"
          value={businessData.cep || ""}
          onChange={handleCepChange}
          onBlur={handleCepBlur}
          placeholder="00000-000"
          required
          error={!businessData.cep ? "CEP é obrigatório" : ""}
          touched={true}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <FormField
            id="business-address"
            label="Endereço"
            value={businessData.address || ""}
            onChange={(value) => handleChange("address", value)}
            required
            error={!businessData.address ? "Endereço é obrigatório" : ""}
            touched={true}
          />
        </div>
        <div>
          <FormField
            id="business-number"
            label="Número"
            value={businessData.number || ""}
            onChange={(value) => handleChange("number", value)}
            required
            error={!businessData.number ? "Número é obrigatório" : ""}
            touched={true}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="business-neighborhood"
          label="Bairro"
          value={businessData.neighborhood || ""}
          onChange={(value) => handleChange("neighborhood", value)}
          required
          error={!businessData.neighborhood ? "Bairro é obrigatório" : ""}
          touched={true}
        />
        <FormField
          id="business-complement"
          label="Complemento (opcional)"
          value={businessData.complement || ""}
          onChange={(value) => handleChange("complement", value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <FormField
            id="business-city"
            label="Cidade"
            value={businessData.city || ""}
            onChange={(value) => handleChange("city", value)}
            required
            error={!businessData.city ? "Cidade é obrigatória" : ""}
            touched={true}
          />
        </div>
        <div>
          <FormField
            id="business-state"
            label="Estado"
            value={businessData.state || ""}
            onChange={(value) => handleChange("state", value)}
            required
            error={!businessData.state ? "Estado é obrigatório" : ""}
            touched={true}
          />
        </div>
      </div>
    </div>
  );
};
