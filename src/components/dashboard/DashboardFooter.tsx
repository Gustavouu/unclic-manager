
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HelpCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardFooter() {
  const lastUpdated = new Date();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 border-t pt-4 mt-6 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <RefreshCcw size={14} />
        <span>Última atualização: {format(lastUpdated, "dd 'de' MMMM 'de' yyyy, 'às' HH:mm", { locale: ptBR })}</span>
      </div>
      <div className="flex gap-3">
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          <HelpCircle size={14} className="mr-1" />
          Suporte
        </Button>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          Documentação
        </Button>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          Reportar problema
        </Button>
      </div>
    </div>
  );
}
