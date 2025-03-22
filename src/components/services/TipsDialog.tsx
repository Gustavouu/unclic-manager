
import { LightbulbIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";

export const generalTips = [
  "Mantenha sua lista de serviços atualizada para refletir as últimas tendências",
  "Considere oferecer pacotes de serviços para aumentar o valor médio por cliente",
  "Revise os preços dos serviços pelo menos a cada seis meses",
  "Adicione fotos do antes e depois para serviços visuais",
  "Destaque os serviços mais rentáveis na sua comunicação",
  "Use descrições claras que explicam o que está incluído em cada serviço",
  "Treine sua equipe para fazer upselling de serviços complementares",
  "Monitore quais serviços são mais populares em diferentes épocas do ano"
];

export const TipsDialog = () => {
  const [tipsOpen, setTipsOpen] = useState(false);
  
  return (
    <Dialog open={tipsOpen} onOpenChange={setTipsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Info size={16} />
          Dicas Gerais
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dicas para Gestão de Serviços</DialogTitle>
          <DialogDescription>
            Estratégias para otimizar sua oferta de serviços
          </DialogDescription>
        </DialogHeader>
        <ul className="mt-4 space-y-2">
          {generalTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <LightbulbIcon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
