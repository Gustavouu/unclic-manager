
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { toast } from "sonner";
import { useBusinessConfig } from "@/hooks/business/useBusinessConfig";

export const SettingsBannerUpload = () => {
  const { businessId } = useCurrentBusiness();
  const { bannerUrl, saveConfig } = useBusinessConfig();
  const [uploading, setUploading] = useState(false);
  
  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !businessId) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${businessId}/banner-${Date.now()}.${fileExt}`;
    const filePath = `business-assets/${fileName}`;

    setUploading(true);

    try {
      // Fazer upload para o Storage do Supabase
      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath);

      // Atualizar URL do banner nas configurações
      const { error: configError } = await supabase
        .from('configuracoes_negocio')
        .update({ banner_url: publicUrl })
        .eq('id_negocio', businessId);

      if (configError) {
        throw configError;
      }

      // Atualizar o estado no hook
      await saveConfig({ bannerUrl: publicUrl });
      
      toast.success("Banner atualizado com sucesso");
    } catch (error: any) {
      console.error("Erro ao fazer upload do banner:", error);
      toast.error(`Erro ao fazer upload: ${error.message || "Erro desconhecido"}`);
    } finally {
      setUploading(false);
      // Limpar input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRemoveBanner = async () => {
    if (!businessId || !bannerUrl) return;

    setUploading(true);

    try {
      // Extrair o caminho do arquivo da URL pública
      const urlParts = bannerUrl.split('business-assets/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        
        // Remover arquivo do storage (opcional)
        await supabase.storage
          .from('business-assets')
          .remove([filePath]);
      }

      // Limpar URL do banner nas configurações
      const { error: configError } = await supabase
        .from('configuracoes_negocio')
        .update({ banner_url: null })
        .eq('id_negocio', businessId);

      if (configError) {
        throw configError;
      }

      // Atualizar o estado no hook
      await saveConfig({ bannerUrl: null });
      
      toast.success("Banner removido com sucesso");
    } catch (error: any) {
      console.error("Erro ao remover banner:", error);
      toast.error(`Erro ao remover banner: ${error.message || "Erro desconhecido"}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Banner do Negócio</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Upload do banner para seu site ou aplicativo
        </p>
      </div>

      {bannerUrl ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full h-40 border rounded-md overflow-hidden bg-gray-50">
            <img 
              src={bannerUrl} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              type="button"
              disabled={uploading}
              onClick={handleRemoveBanner}
            >
              <X className="mr-2 h-4 w-4" />
              Remover
            </Button>
            <Label 
              htmlFor="banner-upload" 
              className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 ${uploading ? 'opacity-50' : ''}`}
            >
              <Upload className="mr-2 h-4 w-4" />
              Trocar Banner
            </Label>
            <input 
              id="banner-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleBannerUpload}
              className="hidden" 
              disabled={uploading}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full h-40 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
            <Upload className="h-10 w-10 text-gray-400" />
          </div>
          <Label 
            htmlFor="banner-upload" 
            className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 ${uploading ? 'opacity-50' : ''}`}
          >
            <Upload className="mr-2 h-4 w-4" />
            Fazer Upload
          </Label>
          <input 
            id="banner-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleBannerUpload}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
};
