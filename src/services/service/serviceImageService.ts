
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export class ServiceImageService {
  private static instance: ServiceImageService;

  private constructor() {}

  public static getInstance(): ServiceImageService {
    if (!ServiceImageService.instance) {
      ServiceImageService.instance = new ServiceImageService();
    }
    return ServiceImageService.instance;
  }

  async uploadImage(file: File, serviceId: string): Promise<string> {
    try {
      console.log('Uploading service image:', { serviceId, fileName: file.name, fileSize: file.size });

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${serviceId}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('service-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error('Erro ao fazer upload da imagem do serviço');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(fileName);

      console.log('Service image uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erro ao fazer upload da imagem');
      throw error;
    }
  }

  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      if (!imageUrl) return true;

      // Extract filename from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      const { error } = await supabase.storage
        .from('service-images')
        .remove([fileName]);

      if (error) {
        console.error('Storage delete error:', error);
        return false;
      }

      console.log('Service image deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  async updateServiceImage(serviceId: string, imageUrl: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('services')
        .update({ image_url: imageUrl })
        .eq('id', serviceId);

      if (error) {
        console.error('Error updating service image URL:', error);
        throw error;
      }

      console.log('Service image URL updated successfully');
    } catch (error) {
      console.error('Error updating service image:', error);
      throw error;
    }
  }
}
