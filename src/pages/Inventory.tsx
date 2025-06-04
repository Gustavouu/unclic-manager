
import { PageHeader } from "@/components/ui/page-header";
import { InventoryContent } from "@/components/inventory/InventoryContent";

export default function Inventory() {
  return (
    <>
      <PageHeader 
        title="Estoque"
        description="Visualize e gerencie seu inventário"
        breadcrumb={[
          { label: "Início", path: "/" },
          { label: "Estoque" }
        ]}
      />
      <InventoryContent />
    </>
  );
}
