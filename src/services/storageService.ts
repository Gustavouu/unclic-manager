
import { supabase } from "@/integrations/supabase/client";

// Inicializar buckets de armazenamento necessários
export const initializeStorage = async () => {
  try {
    // Verificar se o bucket business-assets já existe
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Erro ao listar buckets:", error);
      return false;
    }
    
    const businessAssetsBucketExists = buckets.some(bucket => bucket.name === 'business-assets');
    
    if (!businessAssetsBucketExists) {
      // Criar o bucket business-assets
      const { error: createError } = await supabase.storage.createBucket('business-assets', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });
      
      if (createError) {
        console.error("Erro ao criar bucket business-assets:", createError);
        return false;
      }
      
      console.log("Bucket business-assets criado com sucesso");
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao inicializar storage:", error);
    return false;
  }
};

// Fazer upload de um arquivo para o storage
export const uploadFile = async (
  bucket: string,
  filePath: string,
  file: File,
  options?: { contentType?: string, upsert?: boolean }
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: options?.contentType || file.type,
        upsert: options?.upsert || false,
      });
      
    if (error) throw error;
    
    // Obter URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return { data, publicUrl };
  } catch (error) {
    console.error(`Erro ao fazer upload do arquivo para ${bucket}/${filePath}:`, error);
    throw error;
  }
};

// Remover um arquivo do storage
export const removeFile = async (bucket: string, filePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Erro ao remover arquivo ${bucket}/${filePath}:`, error);
    throw error;
  }
};

// Obter URL pública de um arquivo
export const getPublicUrl = (bucket: string, filePath: string) => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
    
  return publicUrl;
};
