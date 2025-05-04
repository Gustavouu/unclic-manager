
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { validateRequired, validateEmail, formatPhone } from "@/utils/formUtils";

type NewClientFormProps = {
  onComplete: (clientData: any) => void;
  onBack: () => void;
};

export const NewClientForm: React.FC<NewClientFormProps> = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    marketingConsent: true
  });
  
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    handleChange("phone", formattedPhone);
  };
  
  const validate = () => {
    const newErrors = {
      firstName: validateRequired(formData.firstName, "Nome"),
      lastName: validateRequired(formData.lastName, "Sobrenome"),
      email: validateEmail(formData.email),
      phone: validateRequired(formData.phone, "Telefone")
    };
    
    setErrors(newErrors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);
    
    // Check if there are any errors
    return !Object.values(newErrors).some(error => error !== null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onComplete(formData);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Seus Dados</h2>
        <p className="text-muted-foreground">
          Precisamos de algumas informações para criar seu cadastro.
        </p>
      </div>
      
      <Separator />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className={errors.firstName && touched.firstName ? "text-destructive" : ""}>
              Nome*
            </Label>
            <Input 
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={errors.firstName && touched.firstName ? "border-destructive" : ""}
            />
            {errors.firstName && touched.firstName && (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName" className={errors.lastName && touched.lastName ? "text-destructive" : ""}>
              Sobrenome*
            </Label>
            <Input 
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={errors.lastName && touched.lastName ? "border-destructive" : ""}
            />
            {errors.lastName && touched.lastName && (
              <p className="text-xs text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className={errors.email && touched.email ? "text-destructive" : ""}>
            Email*
          </Label>
          <Input 
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={errors.email && touched.email ? "border-destructive" : ""}
          />
          {errors.email && touched.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className={errors.phone && touched.phone ? "text-destructive" : ""}>
            Telefone*
          </Label>
          <Input 
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="(00) 00000-0000"
            className={errors.phone && touched.phone ? "border-destructive" : ""}
          />
          {errors.phone && touched.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="marketingConsent" 
            checked={formData.marketingConsent}
            onCheckedChange={(checked) => handleChange("marketingConsent", !!checked)}
          />
          <Label htmlFor="marketingConsent" className="text-sm text-muted-foreground">
            Aceito receber novidades, promoções e comunicados via email e WhatsApp
          </Label>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit">
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
};
