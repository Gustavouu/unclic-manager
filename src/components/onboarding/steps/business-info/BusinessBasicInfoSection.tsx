
import React from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export const BusinessBasicInfoSection: React.FC = () => {
  const { businessData, updateBusinessData } = useOnboarding();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateBusinessData({ [name]: value });
  };
  
  const handleBlur = (fieldName: string) => {
    if (fieldName === 'name' && !businessData.name) {
      toast.warning("Nome do negócio é obrigatório");
    } else if (fieldName === 'email' && !businessData.email) {
      toast.warning("Email é obrigatório");
    } else if (fieldName === 'phone' && !businessData.phone) {
      toast.warning("Telefone é obrigatório");
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5" /> 
          Informações Básicas
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nome do Negócio <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="name"
            name="name"
            value={businessData.name || ''}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            placeholder="Nome do seu negócio"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">
            Email de Contato <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Input 
              id="email"
              name="email"
              type="email"
              value={businessData.email || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="contato@seunegocio.com"
              required
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">
            Telefone <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <Input 
              id="phone"
              name="phone"
              type="tel"
              value={businessData.phone || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('phone')}
              placeholder="(00) 00000-0000"
              required
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input 
            id="website"
            name="website"
            type="url"
            value={businessData.website || ''}
            onChange={handleChange}
            placeholder="https://seunegocio.com"
          />
        </div>
      </CardContent>
    </Card>
  );
};
