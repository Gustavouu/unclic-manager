
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const BusinessBasicInfoSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateBusinessData({
      [name]: value
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>
          Informe os dados principais do seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Estabelecimento *</Label>
          <Input
            id="name"
            name="name"
            value={businessData.name || ""}
            onChange={handleChange}
            placeholder="Ex: Salão Beauty Hair"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-mail comercial *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={businessData.email || ""}
            onChange={handleChange}
            placeholder="Ex: contato@seunegoico.com.br"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone comercial *</Label>
          <Input
            id="phone"
            name="phone"
            value={businessData.phone || ""}
            onChange={handleChange}
            placeholder="Ex: (11) 99999-9999"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Site (opcional)</Label>
          <Input
            id="website"
            name="website"
            value={businessData.website || ""}
            onChange={handleChange}
            placeholder="Ex: www.seunegoico.com.br"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            name="description"
            value={businessData.description || ""}
            onChange={handleChange}
            placeholder="Descreva brevemente o seu estabelecimento"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};
