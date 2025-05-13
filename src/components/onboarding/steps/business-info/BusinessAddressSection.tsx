
import React, { useState } from "react";
import { FormField } from "@/components/ui/form-field";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const BusinessAddressSection = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const [addressError, setAddressError] = useState("");
  const [addressTouched, setAddressTouched] = useState(false);
  
  // Handle address field changes
  const handleAddressChange = (field: string, value: string) => {
    updateBusinessData({ [field]: value });
    
    // Reset error if address is filled
    if (field === 'address' && value && addressError) {
      setAddressError("");
    }
  };
  
  // Validate address on blur
  const validateAddress = () => {
    setAddressTouched(true);
    if (!businessData.address) {
      setAddressError("O endereço é obrigatório");
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Endereço</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormField
            id="business-cep"
            label="CEP"
            value={businessData.zipCode || ""}
            onChange={(value) => handleAddressChange("zipCode", value)}
            placeholder="00000-000"
          />
        </div>
        
        <div className="md:col-span-2">
          <FormField
            id="business-address"
            label="Endereço"
            value={businessData.address || ""}
            onChange={(value) => handleAddressChange("address", value)}
            placeholder="Rua, Avenida, etc."
            required={true}
            error={addressTouched ? addressError : ""}
            onFocus={() => setAddressTouched(true)}
          />
        </div>
        
        <FormField
          id="business-number"
          label="Número"
          value={businessData.addressNumber || ""}
          onChange={(value) => handleAddressChange("addressNumber", value)}
          placeholder="123"
        />
        
        <FormField
          id="business-complement"
          label="Complemento"
          value={businessData.addressComplement || ""}
          onChange={(value) => handleAddressChange("addressComplement", value)}
          placeholder="Apto, Sala, etc."
        />
        
        <FormField
          id="business-neighborhood"
          label="Bairro"
          value={businessData.neighborhood || ""}
          onChange={(value) => handleAddressChange("neighborhood", value)}
          placeholder="Centro"
        />
        
        <FormField
          id="business-city"
          label="Cidade"
          value={businessData.city || ""}
          onChange={(value) => handleAddressChange("city", value)}
          placeholder="São Paulo"
        />
        
        <FormField
          id="business-state"
          label="Estado"
          value={businessData.state || ""}
          onChange={(value) => handleAddressChange("state", value)}
          placeholder="SP"
        />
      </div>
    </div>
  );
};
