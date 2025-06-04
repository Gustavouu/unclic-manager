
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Building, MapPin, Phone, Mail, User, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export const BusinessInfoStepFixed = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  // Estados brasileiros
  const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  // Tipos de negócio
  const businessTypes = [
    "Salão de Beleza",
    "Barbearia", 
    "Clínica Estética",
    "Spa",
    "Academia",
    "Consultório",
    "Pet Shop",
    "Outro"
  ];

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Nome do negócio é obrigatório';
        } else if (value.length < 2) {
          newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'phone':
        if (value && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value)) {
          newErrors.phone = 'Formato: (11) 99999-9999';
        } else {
          delete newErrors.phone;
        }
        break;
        
      case 'adminEmail':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.adminEmail = 'Email inválido';
        } else {
          delete newErrors.adminEmail;
        }
        break;
        
      case 'zipCode':
        if (value && !/^\d{5}-?\d{3}$/.test(value)) {
          newErrors.zipCode = 'CEP deve ter 8 dígitos';
        } else {
          delete newErrors.zipCode;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    updateBusinessData({ [field]: value });
    validateField(field, value);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleInputChange('phone', formatted);
  };

  const handleZipCodeChange = (value: string) => {
    const formatted = formatZipCode(value);
    handleInputChange('zipCode', formatted);
  };

  // Validação inicial
  useEffect(() => {
    if (businessData.name) {
      validateField('name', businessData.name);
    }
  }, []);

  const hasRequiredFields = businessData.name && businessData.name.trim().length >= 2;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Informações do Negócio
        </CardTitle>
        <CardDescription>
          Vamos começar com as informações básicas do seu estabelecimento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Básicas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">
                Nome do Negócio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="business-name"
                placeholder="Ex: Salão Beleza & Estilo"
                value={businessData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-type">Tipo de Negócio</Label>
              <Select 
                value={businessData.businessType || ''} 
                onValueChange={(value) => handleInputChange('businessType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-description">Descrição (Opcional)</Label>
            <Textarea
              id="business-description"
              placeholder="Descreva brevemente seu negócio..."
              value={businessData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner-name">Nome do Proprietário</Label>
            <Input
              id="owner-name"
              placeholder="Seu nome completo"
              value={businessData.ownerName || ''}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
            />
          </div>
        </div>

        {/* Contato */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contato
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business-phone">Telefone</Label>
              <Input
                id="business-phone"
                placeholder="(11) 99999-9999"
                value={businessData.phone || ''}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-email">Email de Contato</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="contato@seunegocio.com"
                value={businessData.adminEmail || ''}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                className={errors.adminEmail ? 'border-red-500' : ''}
              />
              {errors.adminEmail && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.adminEmail}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Endereço (Opcional)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip-code">CEP</Label>
              <Input
                id="zip-code"
                placeholder="00000-000"
                value={businessData.zipCode || ''}
                onChange={(e) => handleZipCodeChange(e.target.value)}
                className={errors.zipCode ? 'border-red-500' : ''}
              />
              {errors.zipCode && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.zipCode}
                </p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Rua/Avenida</Label>
              <Input
                id="address"
                placeholder="Nome da rua"
                value={businessData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address-number">Número</Label>
              <Input
                id="address-number"
                placeholder="123"
                value={businessData.addressNumber || ''}
                onChange={(e) => handleInputChange('addressNumber', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                placeholder="Centro"
                value={businessData.neighborhood || ''}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="São Paulo"
                value={businessData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Select 
                value={businessData.state || ''} 
                onValueChange={(value) => handleInputChange('state', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map(state => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Status de Validação */}
        {!hasRequiredFields && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Preencha pelo menos o nome do negócio para continuar.
            </AlertDescription>
          </Alert>
        )}

        {hasRequiredFields && !hasErrors && (
          <Alert className="border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Informações básicas preenchidas! Você pode continuar para o próximo passo.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
