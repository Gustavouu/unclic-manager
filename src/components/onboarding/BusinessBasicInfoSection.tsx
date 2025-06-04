
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface BusinessBasicInfoSectionProps {
  businessName: string;
  setBusinessName: (name: string) => void;
  businessDescription: string;
  setBusinessDescription: (description: string) => void;
  businessPhone: string;
  setBusinessPhone: (phone: string) => void;
  businessAddress: string;
  setBusinessAddress: (address: string) => void;
  onNext: () => void;
}

export const BusinessBasicInfoSection: React.FC<BusinessBasicInfoSectionProps> = ({
  businessName,
  setBusinessName,
  businessDescription,
  setBusinessDescription,
  businessPhone,
  setBusinessPhone,
  businessAddress,
  setBusinessAddress,
  onNext,
}) => {
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessName.trim()) {
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Informações Básicas do Negócio
        </CardTitle>
        <CardDescription>
          Vamos começar com as informações principais do seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Nome do Negócio *</Label>
            <Input
              id="business-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Digite o nome do seu negócio"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-description">Descrição</Label>
            <Textarea
              id="business-description"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              placeholder="Descreva brevemente o seu negócio"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone
            </Label>
            <Input
              id="business-phone"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              type="tel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Endereço
            </Label>
            <Input
              id="business-address"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="Endereço completo do negócio"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!businessName.trim()}
          >
            Continuar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
