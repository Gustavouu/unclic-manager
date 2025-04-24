
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useClients } from "@/hooks/useClients";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface NewClientDialogProps {
  onClose: () => void;
  onClientCreated?: (client: any) => void;
}

type FormData = {
  nome: string;
  email: string;
  telefone: string;
  cidade?: string;
  estado?: string;
};

export const NewClientDialog = ({ onClose, onClientCreated }: NewClientDialogProps) => {
  const { createClient } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      cidade: '',
      estado: '',
    }
  });
  
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const newClient = await createClient(data);
      
      if (newClient && onClientCreated) {
        onClientCreated(newClient);
        toast.success("Cliente criado com sucesso!");
      }
      
      onClose();
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Erro ao criar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input 
                id="nome" 
                {...register('nome', { required: 'Nome é obrigatório' })}
                placeholder="Nome completo do cliente" 
              />
              {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                {...register('email')}
                placeholder="email@exemplo.com" 
              />
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label htmlFor="telefone">Telefone</Label>
              <Input 
                id="telefone"
                {...register('telefone')}
                placeholder="(00) 00000-0000" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="cidade">Cidade</Label>
                <Input 
                  id="cidade"
                  {...register('cidade')}
                  placeholder="Cidade" 
                />
              </div>
              
              <div className="grid w-full gap-1.5">
                <Label htmlFor="estado">Estado</Label>
                <Input 
                  id="estado"
                  {...register('estado')}
                  placeholder="Estado" 
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
