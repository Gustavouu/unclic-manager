
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { toast } from "sonner";

export const SettingsLogoUpload = () => {
  const { businessId, businessData, fetchBusinessData } = useCurrentBusiness();
  const [uploading, setUploading] = useState(false);
  
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !businessId) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${businessId}/logo-${Date.now()}.${fileExt}`;
    const filePath = `business-logos/${fileName}`;

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

      // Atualizar URL do logo no banco de dados
      const { error: updateError } = await supabase
        .from('negocios')
        .update({ url_logo: publicUrl })
        .eq('id', businessId);

      if (updateError) {
        throw updateError;
      }

      // Também atualizar na tabela de configurações
      const { error: configError } = await supabase
        .from('configuracoes_negocio')
        .update({ logo_url: publicUrl })
        .eq('id_negocio', businessId);

      if (configError) {
        console.warn("Erro ao atualizar logo nas configurações:", configError);
      }

      toast.success("Logo atualizado com sucesso");
      fetchBusinessData(true); // Atualizar dados do negócio
    } catch (error: any) {
      console.error("Erro ao fazer upload do logo:", error);
      toast.error(`Erro ao fazer upload: ${error.message || "Erro desconhecido"}`);
    } finally {
      setUploading(false);
      // Limpar input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRemoveLogo = async () => {
    if (!businessId || !businessData?.url_logo) return;

    setUploading(true);

    try {
      // Extrair o caminho do arquivo da URL pública
      const urlParts = businessData.url_logo.split('business-assets/');
      const filePath = urlParts[1];

      if (filePath) {
        // Remover arquivo do storage (opcional)
        await supabase.storage
          .from('business-assets')
          .remove([filePath]);
      }

      // Limpar URL do logo
      const { error: updateError } = await supabase
        .from('negocios')
        .update({ url_logo: null })
        .eq('id', businessId);

      if (updateError) {
        throw updateError;
      }

      // Limpar também na tabela de configurações
      const { error: configError } = await supabase
        .from('configuracoes_negocio')
        .update({ logo_url: null })
        .eq('id_negocio', businessId);

      if (configError) {
        console.warn("Erro ao limpar logo nas configurações:", configError);
      }

      toast.success("Logo removido com sucesso");
      fetchBusinessData(true);
    } catch (error: any) {
      console.error("Erro ao remover logo:", error);
      toast.error(`Erro ao remover logo: ${error.message || "Erro desconhecido"}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Logo do Negócio</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Upload do logo principal do seu negócio
        </p>
      </div>

      {businessData?.url_logo ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
            <img 
              src={businessData.url_logo} 
              alt="Logo" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              type="button"
              disabled={uploading}
              onClick={handleRemoveLogo}
            >
              <X className="mr-2 h-4 w-4" />
              Remover
            </Button>
            <Label 
              htmlFor="logo-upload" 
              className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 ${uploading ? 'opacity-50' : ''}`}
            >
              <Upload className="mr-2 h-4 w-4" />
              Trocar Logo
            </Label>
            <input 
              id="logo-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleLogoUpload}
              className="hidden" 
              disabled={uploading}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
            <Upload className="h-10 w-10 text-gray-400" />
          </div>
          <Label 
            htmlFor="logo-upload" 
            className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 ${uploading ? 'opacity-50' : ''}`}
          >
            <Upload className="mr-2 h-4 w-4" />
            Fazer Upload
          </Label>
          <input 
            id="logo-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleLogoUpload}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
};
