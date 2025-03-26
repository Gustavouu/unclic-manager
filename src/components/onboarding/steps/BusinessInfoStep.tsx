
import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Upload, Image } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { fetchAddressByCEP, formatCEP, validateCEP } from "@/utils/addressUtils";
import { validateEmail, validatePhone } from "@/utils/formUtils";

export const BusinessInfoStep: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);

  // Manipuladores para os campos
  const handleChange = (field: string, value: string) => {
    updateBusinessData({ [field]: value });
  };

  const handleCEPChange = (value: string) => {
    const formattedCEP = formatCEP(value);
    updateBusinessData({ cep: formattedCEP });
  };

  const handleFileChange = (field: 'logo' | 'banner', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateBusinessData({ [field]: e.target.files[0] });
    }
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Básicas</h3>
          
          <FormField
            id="business-name"
            label="Nome do Estabelecimento"
            value={businessData.name}
            onChange={(value) => handleChange("name", value)}
            error={!businessData.name && "O nome do estabelecimento é obrigatório"}
            touched={true}
            required
          />
          
          <FormField
            id="business-email"
            label="Email de Contato"
            type="email"
            value={businessData.email}
            onChange={(value) => handleChange("email", value)}
            error={validateEmail(businessData.email)}
            touched={true}
            required
          />
          
          <FormField
            id="business-phone"
            label="Telefone"
            type="tel"
            value={businessData.phone}
            onChange={(value) => handleChange("phone", value)}
            error={validatePhone(businessData.phone)}
            touched={true}
            required
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Logotipo e Banner</h3>
          
          <div className="space-y-2">
            <Label htmlFor="business-logo">Logotipo</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {businessData.logo ? (
                  <img 
                    src={URL.createObjectURL(businessData.logo)} 
                    alt="Logo Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="h-6 w-6 text-gray-500" />
                )}
              </div>
              <div>
                <Button variant="outline" type="button" className="relative overflow-hidden">
                  <Upload className="h-4 w-4 mr-2" />
                  Adicionar Logotipo
                  <input
                    type="file"
                    id="business-logo"
                    accept="image/*"
                    onChange={(e) => handleFileChange('logo', e)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Recomendado: 400x400px, JPG ou PNG
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="business-banner">Banner</Label>
            <div className="flex items-center gap-4">
              <div className="w-48 h-24 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                {businessData.banner ? (
                  <img 
                    src={URL.createObjectURL(businessData.banner)} 
                    alt="Banner Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="h-6 w-6 text-gray-500" />
                )}
              </div>
              <div>
                <Button variant="outline" type="button" className="relative overflow-hidden">
                  <Upload className="h-4 w-4 mr-2" />
                  Adicionar Banner
                  <input
                    type="file"
                    id="business-banner"
                    accept="image/*"
                    onChange={(e) => handleFileChange('banner', e)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Recomendado: 1200x400px, JPG ou PNG
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
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
    </div>
  );
};
