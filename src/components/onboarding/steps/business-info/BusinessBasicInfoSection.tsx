
import React from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BusinessBasicInfoSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Negócio *</Label>
          <Input
            id="name"
            placeholder="Ex: Barbearia Silva"
            value={businessData.name || ""}
            onChange={(e) => updateBusinessData({ name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email de Contato *</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ex: contato@exemplo.com"
            value={businessData.email || ""}
            onChange={(e) => updateBusinessData({ email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            placeholder="Ex: (11) 99999-9999"
            value={businessData.phone || ""}
            onChange={(e) => updateBusinessData({ phone: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Descreva seu negócio em poucas palavras"
            value={businessData.description || ""}
            onChange={(e) => updateBusinessData({ description: e.target.value })}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
