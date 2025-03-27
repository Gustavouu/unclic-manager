
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const LogoImagesSection = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const { businessData, updateBusinessData } = useOnboarding();
  
  // Load logo and banner from onboarding if available
  useEffect(() => {
    if (businessData) {
      if (businessData.logo) {
        setLogoFile(businessData.logo);
        setLogoUrl(URL.createObjectURL(businessData.logo));
      }
      if (businessData.banner) {
        setCoverFile(businessData.banner);
        setCoverUrl(URL.createObjectURL(businessData.banner));
      }
    }
  }, [businessData]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoUrl(URL.createObjectURL(file));
      updateBusinessData({ logo: file });
      toast.success("Logotipo selecionado com sucesso!");
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverUrl(URL.createObjectURL(file));
      updateBusinessData({ banner: file });
      toast.success("Imagem de capa selecionada com sucesso!");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Logotipo e Imagens</h3>
      
      <div className="space-y-2">
        <Label htmlFor="business-logo">Logotipo</Label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo Preview" 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <Upload className="h-6 w-6 text-gray-500" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" type="button" asChild>
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Alterar Logotipo
                <input 
                  id="logo-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </label>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="business-cover">Imagem de Capa</Label>
        <div className="flex items-center gap-4">
          <div className="w-48 h-24 rounded-md bg-gray-200 flex items-center justify-center">
            {coverUrl ? (
              <img 
                src={coverUrl} 
                alt="Cover Preview" 
                className="w-full h-full rounded-md object-cover" 
              />
            ) : (
              <Upload className="h-6 w-6 text-gray-500" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" type="button" asChild>
              <label htmlFor="cover-upload" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Alterar Imagem
                <input 
                  id="cover-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleCoverChange}
                />
              </label>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
