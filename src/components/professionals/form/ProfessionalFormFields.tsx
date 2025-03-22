
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalCreateForm } from "@/hooks/professionals/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus } from "lucide-react";
import React, { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ProfessionalFormFieldsProps {
  form: UseFormReturn<ProfessionalCreateForm>;
  specialties: string[];
  editMode?: boolean;
  initialPhotoUrl?: string;
}

export const ProfessionalFormFields = ({ 
  form, 
  specialties = [],
  editMode = false,
  initialPhotoUrl = "" 
}: ProfessionalFormFieldsProps) => {
  // Garantir que specialties é sempre um array
  const safeSpecialties = React.useMemo(() => 
    Array.isArray(specialties) ? specialties : [], 
    [specialties]
  );
  
  const [previewUrl, setPreviewUrl] = useState<string>(initialPhotoUrl || "");
  
  // Manipular o upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulação de upload - em produção, você enviaria para um serviço de armazenamento
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        form.setValue("photoUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Obter iniciais para o fallback do avatar
  const getInitials = (name: string) => {
    return name 
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      : "??";
  };
  
  const name = form.watch("name") || "";
  
  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-gray-200">
            <AvatarImage src={previewUrl} alt={name} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          
          <FormField
            control={form.control}
            name="photoUrl"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="absolute -bottom-2 -right-2">
                <FormControl>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      onChange={(e) => {
                        handleImageUpload(e);
                        field.onBlur();
                      }}
                      {...field}
                    />
                    <Button 
                      type="button" 
                      size="icon" 
                      className="h-8 w-8 bg-primary text-primary-foreground rounded-full"
                    >
                      <ImagePlus size={16} />
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo *</FormLabel>
              <FormControl>
                <Input placeholder="Nome do colaborador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Cabeleireiro, Manicure, etc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="commissionPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comissão (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0" 
                  min="0" 
                  max="100" 
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Percentual de comissão sobre serviços realizados
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialties"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especialização *</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange([value])}
                value={Array.isArray(field.value) && field.value.length > 0 ? field.value[0] : ""}
                defaultValue=""
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma especialização" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {safeSpecialties.length > 0 ? (
                    safeSpecialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Sem especializações disponíveis
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Selecione a especialização principal deste profissional
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Biografia</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Conte um pouco sobre o profissional..." 
                className="resize-none h-24"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
