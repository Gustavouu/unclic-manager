
import React, { useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "../cards/ServiceCard";
import { ServiceDialog } from "../dialogs/ServiceDialog";
import { PlusCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export const ServicesStep: React.FC = () => {
  const { services, addService, updateService, removeService } = useOnboarding();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  
  const handleAddService = (data: {
    name: string;
    duration: number;
    price: number;
    description?: string;
  }) => {
    if (editingService) {
      // Atualizando serviço existente
      updateService(editingService, {
        nome: data.name,
        name: data.name,
        duracao: data.duration,
        duration: data.duration,
        preco: data.price,
        price: data.price,
        descricao: data.description,
        description: data.description,
        ativo: true,
        active: true,
      });
      toast.success("Serviço atualizado com sucesso!");
    } else {
      // Adicionando novo serviço
      const newService = {
        id: uuidv4(),
        nome: data.name,
        name: data.name,
        duracao: data.duration,
        duration: data.duration,
        preco: data.price,
        price: data.price,
        descricao: data.description,
        description: data.description,
        ativo: true,
        active: true,
      };
      addService(newService);
      toast.success("Serviço adicionado com sucesso!");
    }
    
    setIsDialogOpen(false);
    setEditingService(null);
  };
  
  const handleEdit = (id: string) => {
    setEditingService(id);
    setIsDialogOpen(true);
  };
  
  const handleRemove = (id: string) => {
    removeService(id);
    toast.success("Serviço removido com sucesso!");
  };
  
  const handleOpenDialog = () => {
    setEditingService(null);
    setIsDialogOpen(true);
  };
  
  const getServiceToEdit = () => {
    if (!editingService) return null;
    return services.find(service => service.id === editingService) || null;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Serviços</h3>
        <Button onClick={handleOpenDialog} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Serviço
        </Button>
      </div>
      
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            Ainda não há serviços cadastrados.
          </p>
          <Button onClick={handleOpenDialog} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Primeiro Serviço
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => handleEdit(service.id)}
              onRemove={() => handleRemove(service.id)}
            />
          ))}
        </div>
      )}
      
      <ServiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddService}
        service={getServiceToEdit()}
      />
    </div>
  );
};
