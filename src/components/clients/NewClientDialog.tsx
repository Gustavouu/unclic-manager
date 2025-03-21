
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface NewClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (newClient: any) => void;
}

export const NewClientDialog = ({ isOpen, onOpenChange, onSubmit }: NewClientDialogProps) => {
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    gender: "",
    category: "Novo"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newClient.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    if (!newClient.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(newClient.email)) {
      newErrors.email = "Email inválido";
    }
    
    if (!newClient.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(newClient);
      setNewClient({
        name: "",
        email: "",
        phone: "",
        city: "",
        gender: "",
        category: "Novo"
      });
      setErrors({});
    }
  };

  const handleChange = (field: string, value: string) => {
    setNewClient({ ...newClient, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus size={16} />
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[485px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha os dados do cliente para adicionar ao sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
              Nome completo*
            </Label>
            <Input 
              id="name" 
              value={newClient.name} 
              onChange={(e) => handleChange("name", e.target.value)} 
              placeholder="Nome do cliente"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                E-mail*
              </Label>
              <Input 
                id="email" 
                type="email" 
                value={newClient.email} 
                onChange={(e) => handleChange("email", e.target.value)} 
                placeholder="email@exemplo.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
                Telefone*
              </Label>
              <Input 
                id="phone" 
                value={newClient.phone} 
                onChange={(e) => handleChange("phone", e.target.value)} 
                placeholder="(00) 00000-0000"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">Cidade</Label>
              <Input 
                id="city" 
                value={newClient.city} 
                onChange={(e) => handleChange("city", e.target.value)} 
                placeholder="São Paulo"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="gender">Gênero</Label>
              <Select 
                value={newClient.gender} 
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={newClient.category} 
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Novo">Novo</SelectItem>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Adicionar Cliente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
