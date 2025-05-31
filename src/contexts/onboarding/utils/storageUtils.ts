
import { supabase } from '@/integrations/supabase/client';

export interface UploadedFile {
  url: string;
  path: string;
}

export const uploadImage = async (
  file: File,
  bucket: string,
  path?: string
): Promise<UploadedFile> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadLogo = async (file: File): Promise<string> => {
  try {
    const uploaded = await uploadImage(file, 'logos', 'business-logos');
    
    const { data, error } = await supabase.storage
      .from('logos')
      .getPublicUrl(uploaded.path);
    
    if (error) throw error;
    
    return data?.publicUrl || uploaded.url;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
};

export const uploadBanner = async (file: File): Promise<string> => {
  try {
    const uploaded = await uploadImage(file, 'banners', 'business-banners');
    
    const { data, error } = await supabase.storage
      .from('banners')
      .getPublicUrl(uploaded.path);
    
    if (error) throw error;
    
    return data?.publicUrl || uploaded.url;
  } catch (error) {
    console.error('Error uploading banner:', error);
    throw error;
  }
};

export const deleteFile = async (bucket: string, path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
