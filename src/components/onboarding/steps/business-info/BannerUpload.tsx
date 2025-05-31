
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface BannerUploadProps {
  bannerUrl?: string | null;
  onBannerChange: (file: File | null) => void;
}

export const BannerUpload: React.FC<BannerUploadProps> = ({ bannerUrl, onBannerChange }) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('O arquivo deve ter no máximo 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      
      onBannerChange(file);
    }
  };

  const handleRemove = () => {
    onBannerChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        {bannerUrl && (
          <div className="relative">
            <img 
              src={bannerUrl} 
              alt="Banner preview" 
              className="w-full h-32 object-cover rounded-lg border"
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
          <label htmlFor="banner-upload">
            <Button type="button" variant="outline" className="cursor-pointer" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                {bannerUrl ? 'Alterar Banner' : 'Adicionar Banner'}
              </span>
            </Button>
          </label>
          <input
            id="banner-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPG ou GIF. Máximo 10MB. Recomendado: 1200x400px.
          </p>
        </div>
      </div>
    </div>
  );
};
