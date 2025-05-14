
import React from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const BusinessAddressSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const fetchAddressByCep = async () => {
    const cep = businessData.zipCode || businessData.cep;
    if (!cep || cep.length < 8) return;
    
    try {
      const formattedCep = cep.replace(/\D/g, "");
      const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        console.error("CEP não encontrado");
        return;
      }
      
      updateBusinessData({
        address: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf
      });
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 relative">
            <Label htmlFor="zipCode">CEP *</Label>
            <div className="flex gap-2">
              <Input
                id="zipCode"
                placeholder="Ex: 01234-567"
                value={businessData.zipCode || businessData.cep || ""}
                onChange={(e) => updateBusinessData({ 
                  zipCode: e.target.value,
                  cep: e.target.value
                })}
                required
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={fetchAddressByCep}
                className="flex-shrink-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Logradouro *</Label>
            <Input
              id="address"
              placeholder="Ex: Av. Paulista"
              value={businessData.address || ""}
              onChange={(e) => updateBusinessData({ address: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addressNumber">Número *</Label>
            <Input
              id="addressNumber"
              placeholder="Ex: 1000"
              value={businessData.addressNumber || businessData.number || ""}
              onChange={(e) => updateBusinessData({ 
                addressNumber: e.target.value,
                number: e.target.value
              })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addressComplement">Complemento</Label>
            <Input
              id="addressComplement"
              placeholder="Ex: Sala 123"
              value={businessData.addressComplement || ""}
              onChange={(e) => updateBusinessData({ addressComplement: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              placeholder="Ex: Centro"
              value={businessData.neighborhood || ""}
              onChange={(e) => updateBusinessData({ neighborhood: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              placeholder="Ex: São Paulo"
              value={businessData.city || ""}
              onChange={(e) => updateBusinessData({ city: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              placeholder="Ex: SP"
              value={businessData.state || ""}
              onChange={(e) => updateBusinessData({ state: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
