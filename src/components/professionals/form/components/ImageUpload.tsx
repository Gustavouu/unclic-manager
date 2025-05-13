
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalCreateForm } from "@/hooks/professionals/types";

interface ImageUploadProps {
  form: UseFormReturn<ProfessionalCreateForm>;
  initialPhotoUrl?: string;
  name: string;
}

export const ImageUpload = ({ form, initialPhotoUrl = "", name }: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  // Atualizar o preview com a URL inicial quando disponível
  useEffect(() => {
    if (initialPhotoUrl) {
      setPreviewUrl(initialPhotoUrl);
    }
  }, [initialPhotoUrl]);
  
  // Manipular o upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulação de upload - em produção, você enviaria para um serviço de armazenamento
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        form.setValue("photo_url", result, { shouldValidate: true, shouldDirty: true });
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
  
  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-gray-200">
          <AvatarImage src={previewUrl} alt={name} />
          <AvatarFallback className="bg-slate-100 text-slate-700 text-xl">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        <FormField
          control={form.control}
          name="photo_url"
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
