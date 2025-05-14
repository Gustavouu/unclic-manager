
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const BusinessAddressSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateBusinessData({
      [name]: value
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço</CardTitle>
        <CardDescription>
          Informe o endereço do seu estabelecimento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={businessData.zipCode || ""}
              onChange={handleChange}
              placeholder="Ex: 01234-567"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              name="address"
              value={businessData.address || ""}
              onChange={handleChange}
              placeholder="Ex: Rua João Silva"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addressNumber">Número</Label>
            <Input
              id="addressNumber"
              name="addressNumber"
              value={businessData.addressNumber || ""}
              onChange={handleChange}
              placeholder="Ex: 123"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addressComplement">Complemento</Label>
            <Input
              id="addressComplement"
              name="addressComplement"
              value={businessData.addressComplement || ""}
              onChange={handleChange}
              placeholder="Ex: Sala 45"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              name="neighborhood"
              value={businessData.neighborhood || ""}
              onChange={handleChange}
              placeholder="Ex: Centro"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              name="city"
              value={businessData.city || ""}
              onChange={handleChange}
              placeholder="Ex: São Paulo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              name="state"
              value={businessData.state || ""}
              onChange={handleChange}
              placeholder="Ex: SP"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
