
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { LogoUploadFixed } from "./LogoUploadFixed";
import { BannerUploadFixed } from "./BannerUploadFixed";

export const BusinessInfoStepFixed: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();

  const handleInputChange = (field: string, value: string) => {
    updateBusinessData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Negócio</CardTitle>
          <CardDescription>
            Vamos começar com as informações básicas do seu estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nome do Negócio *</Label>
              <Input
                id="businessName"
                value={businessData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Digite o nome do seu negócio"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessEmail">Email de Contato *</Label>
              <Input
                id="businessEmail"
                type="email"
                value={businessData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="contato@seunegocio.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Telefone</Label>
              <Input
                id="businessPhone"
                value={businessData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessCep">CEP</Label>
              <Input
                id="businessCep"
                value={businessData.cep || businessData.zipCode || ""}
                onChange={(e) => handleInputChange("cep", e.target.value)}
                placeholder="00000-000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress">Endereço</Label>
            <Input
              id="businessAddress"
              value={businessData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Rua, Avenida, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessNumber">Número</Label>
              <Input
                id="businessNumber"
                value={businessData.number || businessData.addressNumber || ""}
                onChange={(e) => handleInputChange("number", e.target.value)}
                placeholder="123"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessNeighborhood">Bairro</Label>
              <Input
                id="businessNeighborhood"
                value={businessData.neighborhood || ""}
                onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                placeholder="Centro"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessCity">Cidade</Label>
              <Input
                id="businessCity"
                value={businessData.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="São Paulo"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessState">Estado</Label>
            <Input
              id="businessState"
              value={businessData.state || ""}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder="SP"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDescription">Descrição (Opcional)</Label>
            <Textarea
              id="businessDescription"
              value={businessData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva seu negócio..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagens do Negócio</CardTitle>
          <CardDescription>
            Adicione logo e banner para personalizar seu negócio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Logo</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Logo que representará seu negócio
            </p>
            <LogoUploadFixed />
          </div>
          
          <div>
            <Label className="text-base font-medium">Banner</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Imagem de capa para o topo da página do seu negócio
            </p>
            <BannerUploadFixed />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
