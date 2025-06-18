
import React from 'react';
import { ImageUploadFixed } from '@/components/ui/ImageUploadFixed';
import { Image } from 'lucide-react';

export const SettingsBannerUpload = () => {
  const [bannerUrl, setBannerUrl] = React.useState<string | null>(null);

  const handleBannerChange = (url: string | null) => {
    setBannerUrl(url);
    // Aqui você salvaria a URL no contexto ou enviaria para o backend
    console.log('Banner alterado:', url);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Banner do Estabelecimento</h3>
        <p className="text-sm text-gray-600 mb-4">
          Imagem que aparecerá no topo da página do seu negócio. Recomendamos 1200x400 pixels.
        </p>
      </div>
      
      <ImageUploadFixed
        id="settings-banner-upload"
        imageUrl={bannerUrl}
        onChange={handleBannerChange}
        icon={<Image className="h-6 w-6" />}
        label="Clique para fazer upload do banner"
        width="100%"
        height="200px"
      />
    </div>
  );
};
