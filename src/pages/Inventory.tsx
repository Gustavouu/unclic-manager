
import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { InventoryContent } from "@/components/inventory/InventoryContent";

export default function Inventory() {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Controle de Estoque</h1>
        <InventoryContent />
      </div>
    </AppLayout>
  );
}
