
import React from 'react';
import { ImageUploadFixed } from '@/components/ui/ImageUploadFixed';
import { Image } from 'lucide-react';

export const SettingsLogoUpload = () => {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);

  const handleLogoChange = (url: string | null) => {
    setLogoUrl(url);
    // Aqui você salvaria a URL no contexto ou enviaria para o backend
    console.log('Logo alterado:', url);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Logo do Negócio</h3>
        <p className="text-sm text-gray-600 mb-4">
          Faça upload do logo da sua empresa. Recomendamos imagens quadradas com pelo menos 200x200 pixels.
        </p>
      </div>
      
      <div className="flex justify-center">
        <ImageUploadFixed
          id="settings-logo-upload"
          imageUrl={logoUrl}
          onChange={handleLogoChange}
          icon={<Image className="h-6 w-6" />}
          label="Clique para fazer upload do logo"
          width="200px"
          height="200px"
        />
      </div>
    </div>
  );
};
