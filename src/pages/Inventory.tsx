
import { AppLayout } from "@/components/layout/AppLayout";
import { InventoryContent } from "@/components/inventory/InventoryContent";

export default function Inventory() {
  return (
    <AppLayout breadcrumb={[
      { label: "Dashboard", path: "/" },
      { label: "Inventory" }
    ]}>
      <InventoryContent />
    </AppLayout>
  );
}
