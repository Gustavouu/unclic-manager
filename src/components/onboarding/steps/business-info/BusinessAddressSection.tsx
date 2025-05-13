
import React, { useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { FormField } from "@/components/ui/form-field";

export const BusinessAddressSection = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const [zipCodeError, setZipCodeError] = useState("");
  
  const handleZipCodeChange = (zipCode: string) => {
    const cleanZipCode = zipCode.replace(/\D/g, '');
    
    // Validate ZIP code format
    if (cleanZipCode.length > 0 && cleanZipCode.length < 8) {
      setZipCodeError("CEP inválido");
    } else {
      setZipCodeError("");
    }
    
    updateBusinessData({ zipCode: cleanZipCode });
    
    // If we have a complete zip code, try to autocomplete the address
    if (cleanZipCode.length === 8) {
      fetchAddressByZipCode(cleanZipCode);
    }
  };
  
  const fetchAddressByZipCode = async (zipCode: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        updateBusinessData({
          address: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        });
      } else {
        setZipCodeError("CEP não encontrado");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };
  
  const handleFocusZipCode = () => {
    // Clear error if user is trying again
    setZipCodeError("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Endereço</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="business-zipcode"
          label="CEP"
          value={businessData.zipCode || ""}
          onChange={handleZipCodeChange}
          placeholder="00000-000"
          required
          error={zipCodeError}
          onBlur={() => {}} // Keep this as a no-op function
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="business-address"
          label="Endereço"
          value={businessData.address || ""}
          onChange={(value) => updateBusinessData({ address: value })}
          placeholder="Rua, Avenida, etc."
          required
        />
        
        <FormField
          id="business-address-number"
          label="Número"
          value={businessData.addressNumber || ""}
          onChange={(value) => updateBusinessData({ addressNumber: value })}
          placeholder="123"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="business-address-complement"
          label="Complemento"
          value={businessData.addressComplement || ""}
          onChange={(value) => updateBusinessData({ addressComplement: value })}
          placeholder="Apto, Sala, etc. (opcional)"
        />
        
        <FormField
          id="business-neighborhood"
          label="Bairro"
          value={businessData.neighborhood || ""}
          onChange={(value) => updateBusinessData({ neighborhood: value })}
          placeholder="Bairro"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="business-city"
          label="Cidade"
          value={businessData.city || ""}
          onChange={(value) => updateBusinessData({ city: value })}
          placeholder="Cidade"
          required
        />
        
        <FormField
          id="business-state"
          label="Estado"
          value={businessData.state || ""}
          onChange={(value) => updateBusinessData({ state: value })}
          placeholder="Estado"
          required
        />
      </div>
    </div>
  );
};
