
import { useEffect, useState } from "react";
import { 
  Sheet, 
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package2, BarChart, Edit, Loader2 } from "lucide-react";
import { InventoryForm } from "./form/InventoryForm";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./details/StatusBadge";
import { DetailsTab } from "./details/DetailsTab";
import { StatsTab } from "./details/StatsTab";
import { formatCurrency, getFormattedDate } from "./details/formatters";
import { getInventoryFormData } from "./details/InventoryFormData";

export const InventoryDetails = ({ item, isOpen, onClose, onUpdateItem, categories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Reset state when item changes
  useEffect(() => {
    setIsEditing(false);
    setActiveTab("details");
  }, [item?.id]);

  if (!item) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-xl">
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const handleUpdate = (formData) => {
    onUpdateItem(item.id, {
      ...formData,
      quantity: parseInt(formData.quantity),
      minimumQuantity: parseInt(formData.minimumQuantity),
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
      sellingPrice: formData.sellingPrice ? parseFloat(formData.sellingPrice) : undefined,
    });
    setIsEditing(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-semibold flex items-center gap-2">
            <Package2 className="h-5 w-5" />
            {item.name}
          </SheetTitle>
          <SheetDescription className="flex flex-wrap gap-2 items-center mt-1">
            <span className="text-muted-foreground">{item.category}</span>
            <StatusBadge item={item} />
            {item.isEquipment && <Badge variant="outline">Equipamento</Badge>}
          </SheetDescription>
        </SheetHeader>

        {!isEditing ? (
          <>
            <div className="flex justify-end mb-4">
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="details">
                  <Package2 className="mr-2 h-4 w-4" />
                  Detalhes
                </TabsTrigger>
                <TabsTrigger value="stats">
                  <BarChart className="mr-2 h-4 w-4" />
                  Estatísticas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <DetailsTab 
                  item={item} 
                  formatCurrency={formatCurrency} 
                  getFormattedDate={getFormattedDate} 
                />
              </TabsContent>

              <TabsContent value="stats">
                <StatsTab 
                  item={item} 
                  formatCurrency={formatCurrency} 
                  getFormattedDate={getFormattedDate} 
                />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <InventoryForm
            initialData={getInventoryFormData(item)}
            categories={categories}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            submitLabel="Atualizar Item"
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
