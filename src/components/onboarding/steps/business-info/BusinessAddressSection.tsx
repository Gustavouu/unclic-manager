import React, { useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { fetchAddressByCEP, formatCEP, validateCEP } from "@/utils/addressUtils";

export const BusinessAddressSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);

  const handleChange = (field: string, value: string) => {
    updateBusinessData({ [field]: value });
  };

  const handleCEPChange = (value: string) => {
    const formattedCEP = formatCEP(value);
    updateBusinessData({ cep: formattedCEP });
  };

  const searchCEP = async () => {
    const cepError = validateCEP(businessData.cep);
    if (cepError) {
      toast.error(cepError);
      return;
    }

    setIsLoadingCEP(true);
    try {
      const addressData = await fetchAddressByCEP(businessData.cep);
      
      if (addressData.error) {
        toast.error(addressData.error);
      } else {
        updateBusinessData({
          address: addressData.street || "",
          neighborhood: addressData.neighborhood || "",
          city: addressData.city || "",
          state: addressData.state || ""
        });
        toast.success("Endereço localizado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsLoadingCEP(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Endereço</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="business-cep">CEP</Label>
          <div className="flex gap-2">
            <Input
              id="business-cep"
              value={businessData.cep}
              onChange={(e) => handleCEPChange(e.target.value)}
              placeholder="00000-000"
              maxLength={9}
            />
            <Button 
              type="button" 
              onClick={searchCEP} 
              disabled={isLoadingCEP} 
              variant="outline"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isLoadingCEP ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="business-address">Logradouro</Label>
          <Input
            id="business-address"
            value={businessData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Ex: Rua das Flores"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="business-number">Número</Label>
          <Input
            id="business-number"
            value={businessData.number}
            onChange={(e) => handleChange("number", e.target.value)}
            placeholder="Ex: 123"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="business-neighborhood">Bairro</Label>
          <Input
            id="business-neighborhood"
            value={businessData.neighborhood}
            onChange={(e) => handleChange("neighborhood", e.target.value)}
            placeholder="Ex: Centro"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="business-city">Cidade</Label>
          <Input
            id="business-city"
            value={businessData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Ex: São Paulo"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="business-state">Estado</Label>
          <Input
            id="business-state"
            value={businessData.state}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="Ex: SP"
            maxLength={2}
          />
        </div>
      </div>
    </div>
  );
};
