
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Link } from "react-router-dom";

interface WebsiteSectionProps {
  updateField: (name: string, value: string) => void;
  getFieldValue: (name: string) => string;
  getFieldError: (name: string) => string | null;
  hasFieldBeenTouched: (name: string) => boolean;
}

export const WebsiteSection = ({ 
  updateField, 
  getFieldValue, 
  getFieldError, 
  hasFieldBeenTouched 
}: WebsiteSectionProps) => {
  const [copied, setCopied] = useState(false);
  const { businessData } = useOnboarding();
  
  // Gera o URL do site baseado no nome do negócio
  const generateWebsiteUrl = () => {
    if (!businessData.name) return "";
    
    // Formata o nome do negócio para URL (remove acentos, espaços, etc.)
    const formattedName = businessData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, ""); // Removidos os hifens
    
    return `${formattedName}.unclic.com.br`;
  };
  
  // Se não houver um site definido, gera um baseado no nome
  const websiteUrl = getFieldValue("businessWebsite") || generateWebsiteUrl();
  
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${websiteUrl}`);
    setCopied(true);
    toast.success("URL copiado para a área de transferência");
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleOpenWebsite = () => {
    window.open(`/${websiteUrl}`, "_blank");
  };
  
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Globe className="h-5 w-5" />
        Site do Estabelecimento
      </h3>
      
      <div className="space-y-2">
        <Label htmlFor="business-website">URL do Site</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center border rounded-md overflow-hidden">
            <span className="bg-muted text-muted-foreground px-3 py-2 text-sm border-r">
              https://
            </span>
            <Input 
              id="business-website" 
              type="text" 
              value={websiteUrl}
              onChange={(e) => updateField("businessWebsite", e.target.value)}
              className="border-0 flex-1" 
              placeholder="seunegocio.unclic.com.br"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            title="Copiar URL"
            onClick={handleCopyUrl}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            title="Abrir site"
            onClick={handleOpenWebsite}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Este é o endereço onde seus clientes podem acessar seu negócio online para agendamentos e pagamentos.
        </p>
      </div>
      
      <div className="p-3 bg-muted rounded-md">
        <p className="text-sm font-medium">Dicas para seu site:</p>
        <ul className="text-sm mt-1 space-y-1 list-disc pl-5">
          <li>Mantenha seu perfil de negócio completo para melhorar a experiência dos clientes.</li>
          <li>Compartilhe este link em suas redes sociais para que seus clientes possam fazer agendamentos.</li>
          <li>Adicione este link à sua biografia do Instagram e outros perfis sociais.</li>
        </ul>
      </div>
      
      <div className="mt-4">
        <Link 
          to={`/${websiteUrl}`} 
          target="_blank"
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <Globe className="h-4 w-4" />
          Visualizar o site (prévia)
        </Link>
      </div>
    </div>
  );
};
