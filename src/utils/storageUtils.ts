
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const uploadImageToStorage = async (
  file: File,
  bucket: string = 'business-images',
  folder: string = 'uploads'
): Promise<string | null> => {
  try {
    if (!file) return null;

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    console.log('Uploading image to storage:', { fileName, bucket, fileSize: file.size });

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      toast.error('Erro ao fazer upload da imagem');
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log('Image uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    toast.error('Erro inesperado ao fazer upload');
    return null;
  }
};

export const deleteImageFromStorage = async (
  url: string,
  bucket: string = 'business-images'
): Promise<boolean> => {
  try {
    if (!url) return true;

    // Extract filename from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const folderName = urlParts[urlParts.length - 2];
    const fullPath = `${folderName}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fullPath]);

    if (error) {
      console.error('Storage delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};
