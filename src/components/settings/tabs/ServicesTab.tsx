
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  isActive: boolean;
  commission: number;
  bufferTime: number;
  maxAdvanceBooking: number;
  minNotice: number;
  allowOnlineBooking: boolean;
}

interface Category {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

export const ServicesTab = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Corte Masculino",
      description: "Corte tradicional masculino",
      duration: 30,
      price: 25,
      category: "corte",
      isActive: true,
      commission: 40,
      bufferTime: 5,
      maxAdvanceBooking: 30,
      minNotice: 60,
      allowOnlineBooking: true
    },
    {
      id: "2", 
      name: "Barba",
      description: "Barba completa com navalha",
      duration: 20,
      price: 15,
      category: "barba",
      isActive: true,
      commission: 35,
      bufferTime: 5,
      maxAdvanceBooking: 30,
      minNotice: 60,
      allowOnlineBooking: true
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: "corte", name: "Cortes", color: "#2563eb", isActive: true },
    { id: "barba", name: "Barba", color: "#dc2626", isActive: true },
    { id: "tratamento", name: "Tratamentos", color: "#16a34a", isActive: true }
  ]);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    category: "corte",
    isActive: true,
    commission: 40,
    bufferTime: 5,
    maxAdvanceBooking: 30,
    minNotice: 60,
    allowOnlineBooking: true
  });

  const [showNewServiceForm, setShowNewServiceForm] = useState(false);

  const toggleServiceStatus = (id: string) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ));
    toast.success("Status do serviço atualizado");
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
    toast.success("Serviço removido");
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
  };

  const handleSaveEdit = () => {
    if (editingService) {
      setServices(prev => prev.map(service => 
        service.id === editingService.id ? editingService : service
      ));
      setEditingService(null);
      toast.success("Serviço atualizado");
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.price && newService.duration) {
      const service: Service = {
        id: Date.now().toString(),
        name: newService.name,
        description: newService.description || "",
        duration: newService.duration,
        price: newService.price,
        category: newService.category || "corte",
        isActive: newService.isActive ?? true,
        commission: newService.commission || 40,
        bufferTime: newService.bufferTime || 5,
        maxAdvanceBooking: newService.maxAdvanceBooking || 30,
        minNotice: newService.minNotice || 60,
        allowOnlineBooking: newService.allowOnlineBooking ?? true
      };
      
      setServices(prev => [...prev, service]);
      setNewService({
        name: "",
        description: "",
        duration: 30,
        price: 0,
        category: "corte",
        isActive: true,
        commission: 40,
        bufferTime: 5,
        maxAdvanceBooking: 30,
        minNotice: 60,
        allowOnlineBooking: true
      });
      setShowNewServiceForm(false);
      toast.success("Serviço adicionado");
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.color || "#6b7280";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Serviços</CardTitle>
          <CardDescription>
            Configure os serviços oferecidos pelo seu negócio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Total de serviços: {services.length} ({services.filter(s => s.isActive).length} ativos)
            </p>
            <Button onClick={() => setShowNewServiceForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          style={{ backgroundColor: getCategoryColor(service.category), color: 'white' }}
                        >
                          {getCategoryName(service.category)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {service.duration}min • R$ {service.price}
                        </span>
                        {!service.isActive && <Badge variant="destructive">Inativo</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleServiceStatus(service.id)}
                    >
                      {service.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditService(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form para novo serviço */}
      {showNewServiceForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Serviço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newServiceName">Nome do Serviço *</Label>
                <Input
                  id="newServiceName"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Corte Masculino"
                />
              </div>
              <div>
                <Label htmlFor="newServiceCategory">Categoria</Label>
                <Select 
                  value={newService.category} 
                  onValueChange={(value) => setNewService(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="newServiceDescription">Descrição</Label>
              <Textarea
                id="newServiceDescription"
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o serviço..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="newServiceDuration">Duração (minutos) *</Label>
                <Input
                  id="newServiceDuration"
                  type="number"
                  value={newService.duration}
                  onChange={(e) => setNewService(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="newServicePrice">Preço (R$) *</Label>
                <Input
                  id="newServicePrice"
                  type="number"
                  step="0.01"
                  value={newService.price}
                  onChange={(e) => setNewService(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="newServiceCommission">Comissão (%)</Label>
                <Input
                  id="newServiceCommission"
                  type="number"
                  value={newService.commission}
                  onChange={(e) => setNewService(prev => ({ ...prev, commission: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Permitir agendamento online</Label>
              </div>
              <Switch
                checked={newService.allowOnlineBooking}
                onCheckedChange={(checked) => setNewService(prev => ({ ...prev, allowOnlineBooking: checked }))}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddService}>Adicionar Serviço</Button>
              <Button variant="outline" onClick={() => setShowNewServiceForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form para editar serviço */}
      {editingService && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Serviço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editServiceName">Nome do Serviço *</Label>
                <Input
                  id="editServiceName"
                  value={editingService.name}
                  onChange={(e) => setEditingService(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="editServiceCategory">Categoria</Label>
                <Select 
                  value={editingService.category} 
                  onValueChange={(value) => setEditingService(prev => prev ? { ...prev, category: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="editServiceDescription">Descrição</Label>
              <Textarea
                id="editServiceDescription"
                value={editingService.description}
                onChange={(e) => setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="editServiceDuration">Duração (minutos) *</Label>
                <Input
                  id="editServiceDuration"
                  type="number"
                  value={editingService.duration}
                  onChange={(e) => setEditingService(prev => prev ? { ...prev, duration: parseInt(e.target.value) } : null)}
                />
              </div>
              <div>
                <Label htmlFor="editServicePrice">Preço (R$) *</Label>
                <Input
                  id="editServicePrice"
                  type="number"
                  step="0.01"
                  value={editingService.price}
                  onChange={(e) => setEditingService(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                />
              </div>
              <div>
                <Label htmlFor="editServiceCommission">Comissão (%)</Label>
                <Input
                  id="editServiceCommission"
                  type="number"
                  value={editingService.commission}
                  onChange={(e) => setEditingService(prev => prev ? { ...prev, commission: parseInt(e.target.value) } : null)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Permitir agendamento online</Label>
              </div>
              <Switch
                checked={editingService.allowOnlineBooking}
                onCheckedChange={(checked) => setEditingService(prev => prev ? { ...prev, allowOnlineBooking: checked } : null)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
              <Button variant="outline" onClick={() => setEditingService(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Categorias de Serviços</CardTitle>
          <CardDescription>
            Gerencie as categorias para organizar seus serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                  {!category.isActive && <Badge variant="destructive">Inativa</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={category.isActive} />
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
