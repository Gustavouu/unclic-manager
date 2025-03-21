
import { useEffect, useState } from "react";
import { 
  Sheet, 
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package2, BarChart, Edit, Loader2 } from "lucide-react";
import { InventoryForm } from "./form/InventoryForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getEmptyInventoryForm } from "./form/inventoryFormValidation";

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

  const formatCurrency = (value?: number) => {
    if (value === undefined) return "—";
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

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

  const getInventoryFormData = () => {
    return {
      name: item.name,
      description: item.description || "",
      category: item.category,
      quantity: item.quantity.toString(),
      minimumQuantity: item.minimumQuantity.toString(),
      costPrice: item.costPrice?.toString() || "",
      sellingPrice: item.sellingPrice?.toString() || "",
      supplier: item.supplier || "",
      location: item.location || "",
      image: item.image || "",
      barcode: item.barcode || "",
      sku: item.sku || "",
      isEquipment: item.isEquipment,
      expirationDate: item.expirationDate || "",
    };
  };

  const getStatusBadge = () => {
    if (item.quantity === 0) {
      return <Badge variant="destructive">Sem estoque</Badge>;
    } else if (item.quantity <= item.minimumQuantity) {
      return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600">Estoque baixo</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">Em estoque</Badge>;
    }
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
            {getStatusBadge()}
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

              <TabsContent value="details" className="space-y-4">
                {item.image && (
                  <div className="flex justify-center my-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-32 w-32 object-cover rounded-md border"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Quantidade</h4>
                      <p className="text-lg font-medium">{item.quantity}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Quant. Mínima</h4>
                      <p className="text-lg font-medium">{item.minimumQuantity}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h4>
                      <p>{item.description || "—"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Preço de Custo</h4>
                        <p>{formatCurrency(item.costPrice)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Preço de Venda</h4>
                        <p>{formatCurrency(item.sellingPrice)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Fornecedor</h4>
                        <p>{item.supplier || "—"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Localização</h4>
                        <p>{item.location || "—"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">SKU</h4>
                        <p>{item.sku || "—"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Código de Barras</h4>
                        <p>{item.barcode || "—"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Data da Validade</h4>
                        <p>{item.expirationDate ? getFormattedDate(item.expirationDate) : "—"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Última Reposição</h4>
                        <p>{item.lastRestockDate ? getFormattedDate(item.lastRestockDate) : "—"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Valor em Estoque</h4>
                      <p className="text-lg font-medium">
                        {formatCurrency(item.quantity * (item.costPrice || 0))}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Margem de Lucro</h4>
                      <p className="text-lg font-medium">
                        {item.costPrice && item.sellingPrice 
                          ? `${(((item.sellingPrice - item.costPrice) / item.costPrice) * 100).toFixed(2)}%` 
                          : "—"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Criado em</h4>
                      <p>{getFormattedDate(item.createdAt)}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Última atualização</h4>
                      <p>{getFormattedDate(item.updatedAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <InventoryForm
            initialData={getInventoryFormData()}
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
