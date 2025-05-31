
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface LogoUploadProps {
  logoUrl?: string | null;
  onLogoChange: (file: File | null) => void;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({ logoUrl, onLogoChange }) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('O arquivo deve ter no máximo 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      
      onLogoChange(file);
    }
  };

  const handleRemove = () => {
    onLogoChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        {logoUrl && (
          <div className="relative">
            <img 
              src={logoUrl} 
              alt="Logo preview" 
              className="w-24 h-24 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        <div className="text-center">
          <label htmlFor="logo-upload">
            <Button type="button" variant="outline" className="cursor-pointer" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                {logoUrl ? 'Alterar Logo' : 'Adicionar Logo'}
              </span>
            </Button>
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPG ou GIF. Máximo 5MB.
          </p>
        </div>
      </div>
    </div>
  );
};
