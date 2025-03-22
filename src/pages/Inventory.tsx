
import React from 'react';
import { InventoryContent } from "@/components/inventory/InventoryContent";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function Inventory() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb items={[
        { label: "Início", active: false },
        { label: "Estoque", active: true }
      ]} />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestão de Estoque</h1>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Dicas gerais
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" side="left">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </span>
                  Controle de Estoque
                </h3>
                <p className="text-sm text-muted-foreground ml-7">
                  Monitore seus produtos, defina alertas de estoque baixo e gerencie seu inventário de forma eficiente.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                  Benefícios
                </h3>
                <p className="text-sm text-muted-foreground ml-7">
                  Evite quebras de estoque, reduza custos e otimize seu investimento em produtos.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-700 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  </span>
                  Atenção
                </h3>
                <p className="text-sm text-muted-foreground ml-7">
                  Produtos com estoque abaixo do mínimo estão destacados com indicadores visuais.
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <InventoryContent />
    </div>
  );
}
