
import React, { useEffect } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { FormField } from "@/components/ui/form-field";
import { validateEmail, validatePhone, formatPhone } from "@/utils/formUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useSlugCheck } from "@/hooks/useSlugCheck";

export const BusinessBasicInfoSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const { 
    slug, 
    isAvailable, 
    loading, 
    error, 
    existingBusiness, 
    suggestions 
  } = useSlugCheck(businessData.name || "");

  // Gera o URL do site baseado no nome do negócio quando o nome muda
  useEffect(() => {
    if (businessData.name && !businessData.website) {
      const formattedName = businessData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, ""); // Removidos os hifens
      
      updateBusinessData({ website: `${formattedName}.unclic.com.br` });
    }
  }, [businessData.name, businessData.website, updateBusinessData]);

  const handleChange = (field: string, value: string) => {
    updateBusinessData({ [field]: value });
  };

  const handlePhoneChange = (value: string) => {
    // Aplica a máscara de formatação ao telefone
    const formattedPhone = formatPhone(value);
    updateBusinessData({ phone: formattedPhone });
  };

  const handleWebsiteChange = (value: string) => {
    updateBusinessData({ website: value });
  };

  const getSlugStatusIcon = () => {
    if (loading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    if (error) return <AlertCircle className="h-4 w-4 text-amber-500" />;
    if (!businessData.name || businessData.name.length < 3) return null;
    return isAvailable 
      ? <CheckCircle2 className="h-4 w-4 text-green-500" /> 
      : <XCircle className="h-4 w-4 text-destructive" />;
  };

  const getSlugHelperText = () => {
    if (loading) return "Verificando disponibilidade...";
    if (error) return error;
    if (!businessData.name || businessData.name.length < 3) return "Digite pelo menos 3 caracteres";
    if (isAvailable) return "Nome disponível!";
    return existingBusiness 
      ? `Nome já utilizado por "${existingBusiness.name}"`
      : "Este nome já está em uso. Por favor, escolha outro nome.";
  };

  const getSuggestionsText = () => {
    if (!suggestions || suggestions.length === 0) return null;
    
    return (
      <div className="mt-2 text-xs">
        <p>Sugestões disponíveis:</p>
        <ul className="list-disc pl-4 mt-1">
          {suggestions.map((suggestion, index) => (
            <li key={index}>
              <button 
                type="button"
                className="text-blue-600 hover:underline focus:outline-none"
                onClick={() => handleChange("name", suggestion.name)}
              >
                {suggestion.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Básicas</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label 
            htmlFor="business-name" 
            className={!businessData.name ? "text-destructive" : ""}
          >
            Nome do Estabelecimento<span className="text-destructive ml-1">*</span>
          </Label>
          {getSlugStatusIcon()}
        </div>
        
        <Input
          id="business-name"
          value={businessData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          className={!isAvailable && businessData.name ? "border-destructive" : ""}
          placeholder="Nome do seu estabelecimento"
        />
        
        <div className={`text-xs ${!isAvailable ? "text-destructive" : "text-muted-foreground"}`}>
          {getSlugHelperText()}
          {!isAvailable && getSuggestionsText()}
        </div>
      </div>
      
      <FormField
        id="business-email"
        label="Email de Contato"
        type="email"
        value={businessData.email || ""}
        onChange={(value) => handleChange("email", value)}
        error={validateEmail(businessData.email)}
        touched={true}
        required
      />
      
      <FormField
        id="business-phone"
        label="Telefone"
        type="tel"
        value={businessData.phone || ""}
        onChange={handlePhoneChange}
        error={validatePhone(businessData.phone)}
        touched={true}
        required
      />
      
      <div className="space-y-2">
        <Label htmlFor="business-website" className="flex items-center gap-1.5">
          <Globe className="h-4 w-4" />
          Site do Estabelecimento
        </Label>
        <div className="flex items-center border rounded-md overflow-hidden">
          <span className="bg-muted text-muted-foreground px-3 py-2 text-sm border-r">
            https://
          </span>
          <Input 
            id="business-website" 
            type="text" 
            value={businessData.website || ""}
            onChange={(e) => handleWebsiteChange(e.target.value)}
            className="border-0" 
            placeholder="seunegocio.unclic.com.br"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Este é o endereço onde seus clientes poderão realizar agendamentos e pagamentos.
        </p>
      </div>
    </div>
  );
};
