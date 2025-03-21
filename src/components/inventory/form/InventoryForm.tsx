
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { InventoryFormData, InventoryFormErrors, validateInventoryForm } from "./inventoryFormValidation";

interface InventoryFormProps {
  initialData?: InventoryFormData;
  categories: string[];
  onSubmit: (data: InventoryFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export const InventoryForm = ({ 
  initialData = {
    name: "",
    description: "",
    category: "",
    quantity: "0",
    minimumQuantity: "5",
    costPrice: "",
    sellingPrice: "",
    supplier: "",
    location: "",
    image: "",
    barcode: "",
    sku: "",
    isEquipment: false,
    expirationDate: ""
  },
  categories, 
  onSubmit, 
  onCancel,
  submitLabel = "Salvar"
}: InventoryFormProps) => {
  const [formData, setFormData] = useState<InventoryFormData>(initialData);
  const [errors, setErrors] = useState<InventoryFormErrors>({});
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateInventoryForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // If creating a new category, use that
    const finalData = {
      ...formData,
      category: isNewCategory && newCategory ? newCategory : formData.category
    };
    
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Item *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nome do produto"
            required
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          {!isNewCategory ? (
            <>
              <div className="flex justify-between items-center">
                <Label htmlFor="category">Categoria *</Label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="h-auto p-0 text-xs"
                  onClick={() => setIsNewCategory(true)}
                >
                  Nova categoria
                </Button>
              </div>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <Label htmlFor="newCategory">Nova Categoria *</Label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="h-auto p-0 text-xs"
                  onClick={() => setIsNewCategory(false)}
                >
                  Usar existente
                </Button>
              </div>
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nome da nova categoria"
                required={isNewCategory}
              />
            </>
          )}
          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Descrição detalhada do item"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantidade em Estoque *</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
          {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimumQuantity">Quantidade Mínima *</Label>
          <Input
            id="minimumQuantity"
            name="minimumQuantity"
            type="number"
            min="0"
            value={formData.minimumQuantity}
            onChange={handleInputChange}
            required
          />
          {errors.minimumQuantity && <p className="text-sm text-destructive">{errors.minimumQuantity}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="costPrice">Preço de Custo (R$)</Label>
          <Input
            id="costPrice"
            name="costPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.costPrice}
            onChange={handleInputChange}
            placeholder="0.00"
          />
          {errors.costPrice && <p className="text-sm text-destructive">{errors.costPrice}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Preço de Venda (R$)</Label>
          <Input
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.sellingPrice}
            onChange={handleInputChange}
            placeholder="0.00"
          />
          {errors.sellingPrice && <p className="text-sm text-destructive">{errors.sellingPrice}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="supplier">Fornecedor</Label>
          <Input
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleInputChange}
            placeholder="Nome do fornecedor"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Ex: Prateleira A3"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU / Código</Label>
          <Input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            placeholder="Código interno (SKU)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="barcode">Código de Barras</Label>
          <Input
            id="barcode"
            name="barcode"
            value={formData.barcode}
            onChange={handleInputChange}
            placeholder="Código EAN/GTIN"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="image">URL da Imagem</Label>
          <Input
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expirationDate">Data de Validade</Label>
          <Input
            id="expirationDate"
            name="expirationDate"
            type="date"
            value={formData.expirationDate}
            onChange={handleInputChange}
          />
          {errors.expirationDate && <p className="text-sm text-destructive">{errors.expirationDate}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2 py-2">
        <Switch
          id="isEquipment"
          checked={formData.isEquipment}
          onCheckedChange={(checked) => handleSwitchChange("isEquipment", checked)}
        />
        <Label htmlFor="isEquipment">Este item é um equipamento</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
};
