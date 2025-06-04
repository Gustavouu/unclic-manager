
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClientOperations } from "@/hooks/clients/useClientOperations";
import { useClients } from "@/hooks/useClients";
import { toast } from "sonner";
import type { Client, ClientFormData } from "@/types/client";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
  onClientUpdated?: (client: Client) => void;
}

export const EditClientDialog: React.FC<EditClientDialogProps> = ({
  open,
  onOpenChange,
  clientId,
  onClientUpdated
}) => {
  const { handleUpdateClient, isSubmitting } = useClientOperations();
  const { clients } = useClients();
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    phone: "",
    birth_date: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    notes: ""
  });

  // Find and load client data when dialog opens
  useEffect(() => {
    if (open && clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setFormData({
          name: client.name || "",
          email: client.email || "",
          phone: client.phone || "",
          birth_date: client.birth_date || "",
          gender: client.gender || "",
          address: client.address || "",
          city: client.city || "",
          state: client.state || "",
          zip_code: client.zip_code || "",
          notes: client.notes || ""
        });
      }
    }
  }, [open, clientId, clients]);

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId) {
      toast.error("ID do cliente não encontrado");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    const success = await handleUpdateClient(clientId, formData);
    if (success) {
      onOpenChange(false);
      if (onClientUpdated) {
        // Find the updated client and call the callback
        const updatedClient = clients.find(c => c.id === clientId);
        if (updatedClient) {
          onClientUpdated(updatedClient);
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize as informações do cliente.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nome completo"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-birth_date">Data de Nascimento</Label>
              <Input
                id="edit-birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleInputChange("birth_date", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-gender">Gênero</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                  <SelectItem value="nao_informado">Não informado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-address">Endereço</Label>
            <Input
              id="edit-address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Rua, número, bairro"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-city">Cidade</Label>
              <Input
                id="edit-city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Cidade"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-state">Estado</Label>
              <Input
                id="edit-state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="UF"
                maxLength={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-zip_code">CEP</Label>
              <Input
                id="edit-zip_code"
                value={formData.zip_code}
                onChange={(e) => handleInputChange("zip_code", e.target.value)}
                placeholder="00000-000"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Observações</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
