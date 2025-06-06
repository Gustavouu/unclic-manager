
import { useState } from 'react';
import { ServiceImageService } from '@/services/service/serviceImageService';
import { toast } from 'sonner';

export const useServiceImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const serviceImageService = ServiceImageService.getInstance();

  const uploadImage = async (file: File, serviceId?: string): Promise<string | null> => {
    if (!file) return null;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return null;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return null;
    }

    setIsUploading(true);

    try {
      const tempServiceId = serviceId || `temp-${Date.now()}`;
      const imageUrl = await serviceImageService.uploadImage(file, tempServiceId);
      toast.success('Imagem enviada com sucesso!');
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao enviar imagem');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
      const success = await serviceImageService.deleteImage(imageUrl);
      if (success) {
        toast.success('Imagem removida com sucesso!');
      }
      return success;
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Erro ao remover imagem');
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    isUploading,
  };
};
