
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export type ClientFormData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  gender: string;
  category: string;
};

export type ClientFormErrors = Record<string, string>;

interface ClientFormProps {
  clientData: ClientFormData;
  errors: ClientFormErrors;
  onChange: (field: string, value: string) => void;
}

export const ClientForm = ({ clientData, errors, onChange }: ClientFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
          Nome completo*
        </Label>
        <Input 
          id="name" 
          value={clientData.name} 
          onChange={(e) => onChange("name", e.target.value)} 
          placeholder="Nome do cliente"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
            E-mail*
          </Label>
          <Input 
            id="email" 
            type="email" 
            value={clientData.email} 
            onChange={(e) => onChange("email", e.target.value)} 
            placeholder="email@exemplo.com"
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
            Telefone*
          </Label>
          <Input 
            id="phone" 
            value={clientData.phone} 
            onChange={(e) => onChange("phone", e.target.value)} 
            placeholder="(00) 00000-0000"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="city">Cidade</Label>
          <Input 
            id="city" 
            value={clientData.city} 
            onChange={(e) => onChange("city", e.target.value)} 
            placeholder="São Paulo"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="gender">Gênero</Label>
          <Select 
            value={clientData.gender} 
            onValueChange={(value) => onChange("gender", value)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Selecione o gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Feminino">Feminino</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="category">Categoria</Label>
        <Select 
          value={clientData.category} 
          onValueChange={(value) => onChange("category", value)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Novo">Novo</SelectItem>
            <SelectItem value="Regular">Regular</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
