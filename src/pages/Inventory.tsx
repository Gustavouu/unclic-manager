
import React from 'react';
import { InventoryContent } from "@/components/inventory/InventoryContent";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export default function Inventory() {
  return (
    <div className="container mx-auto py-6">
      <Breadcrumb items={[
        { label: "Início", active: false },
        { label: "Produtos", active: true }
      ]} />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4">
          <h1 className="text-2xl font-bold mb-6">Controle de Estoque</h1>
          <InventoryContent />
        </div>
        
        <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
          <div className="border rounded-md p-4 bg-white">
            <h2 className="text-lg font-semibold mb-4">Dicas gerais</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </span>
                  O que é controle de estoque?
                </h3>
                <p className="text-sm text-muted-foreground ml-7">
                  O controle de estoque permite acompanhar todos os produtos, 
                  monitorar quantidades e receber alertas quando for necessário reabastecer.
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
                  Controle mais eficiente dos produtos, redução de perdas, 
                  melhor planejamento de compras e maior satisfação dos clientes.
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
                  Configure corretamente as quantidades mínimas de estoque 
                  para receber alertas quando for necessário repor produtos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
