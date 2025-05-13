
import React, { useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { fetchAddressByCEP, formatCEP, validateCEP } from "@/utils/addressUtils";

export const BusinessAddressSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    updateBusinessData({ [field]: value });
  };

  const handleCepChange = (value: string) => {
    const formattedCep = formatCEP(value);
    updateBusinessData({ 
      cep: formattedCep,
      zipCode: formattedCep 
    });
    setCepError(null);
  };

  const handleFetchAddress = async () => {
    const cep = businessData.cep || businessData.zipCode;
    if (!cep) {
      setCepError("Informe o CEP para buscar o endereço");
      return;
    }

    const cepError = validateCEP(cep);
    if (cepError) {
      setCepError(cepError);
      return;
    }

    setIsLoadingCep(true);
    try {
      const addressData = await fetchAddressByCEP(cep);
      
      if (addressData.error) {
        setCepError(addressData.error);
        return;
      }
      
      updateBusinessData({
        address: addressData.street || "",
        neighborhood: addressData.neighborhood || "",
        city: addressData.city || "",
        state: addressData.state || ""
      });
      
    } catch (error) {
      setCepError("Erro ao buscar CEP. Verifique sua conexão.");
    } finally {
      setIsLoadingCep(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Endereço</h3>
      
      <div className="space-y-2">
        <FormField
          id="business-cep"
          label="CEP"
          value={businessData.cep || businessData.zipCode || ""}
          onChange={handleCepChange}
          error={cepError}
          required
          placeholder="00000-000"
          rightElement={
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleFetchAddress}
              disabled={isLoadingCep}
              type="button"
              aria-label="Buscar endereço pelo CEP"
            >
              {isLoadingCep ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            </Button>
          }
        />
      </div>
      
      <FormField
        id="business-address"
        label="Logradouro"
        value={businessData.address || ""}
        onChange={(value) => handleChange("address", value)}
        error={!businessData.address ? "O endereço é obrigatório" : ""}
        required
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="business-number"
          label="Número"
          value={businessData.number || businessData.addressNumber || ""}
          onChange={(value) => {
            updateBusinessData({ 
              number: value,
              addressNumber: value
            });
          }}
          error={!businessData.number && !businessData.addressNumber ? "O número é obrigatório" : ""}
          required
        />
        
        <FormField
          id="business-complement"
          label="Complemento"
          value={businessData.addressComplement || ""}
          onChange={(value) => {
            updateBusinessData({ addressComplement: value });
          }}
        />
      </div>
      
      <FormField
        id="business-neighborhood"
        label="Bairro"
        value={businessData.neighborhood || ""}
        onChange={(value) => handleChange("neighborhood", value)}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="business-city"
          label="Cidade"
          value={businessData.city || ""}
          onChange={(value) => handleChange("city", value)}
          error={!businessData.city ? "A cidade é obrigatória" : ""}
          required
        />
        
        <FormField
          id="business-state"
          label="Estado"
          value={businessData.state || ""}
          onChange={(value) => handleChange("state", value)}
          error={!businessData.state ? "O estado é obrigatório" : ""}
          required
        />
      </div>
    </div>
  );
};
