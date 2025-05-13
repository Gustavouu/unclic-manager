
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useClients, ClienteInput } from "@/hooks/useClients";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { handleApiError, handleFormErrors } from '@/utils/errorHandler';
import { sanitizeFormData } from '@/utils/sanitize';
import * as z from 'zod';
import { useTenant } from '@/contexts/TenantContext';

const clientSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  telefone: z.string().optional().or(z.literal('')),
  cidade: z.string().optional().or(z.literal('')),
  estado: z.string().optional().or(z.literal('')),
});

type FormData = z.infer<typeof clientSchema>;

interface NewClientDialogProps {
  onClose: () => void;
  onClientCreated?: (client: any) => void;
}

export const NewClientDialog = ({ onClose, onClientCreated }: NewClientDialogProps) => {
  const { createClient } = useClients();
  const { currentBusiness } = useTenant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(clientSchema),
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
      console.log("Submitting client data:", data);
      
      // Sanitizar os dados do formulário
      const sanitizedData = sanitizeFormData(data);
      
      if (!currentBusiness?.id) {
        throw new Error('ID do negócio não disponível');
      }
      
      // Ensure all required fields are present with proper types
      const clientData: ClienteInput = {
        nome: sanitizedData.nome,
        email: sanitizedData.email || undefined,
        telefone: sanitizedData.telefone || undefined,
        cidade: sanitizedData.cidade || undefined,
        estado: sanitizedData.estado || undefined,
        // Garantir que o ID do negócio esteja sempre presente
        id_negocio: currentBusiness.id
      };
      
      const newClient = await createClient(clientData);
      
      if (newClient && onClientCreated) {
        onClientCreated(newClient);
        toast.success("Cliente criado com sucesso!");
      }
      
      onClose();
    } catch (error) {
      handleApiError(error, "Erro ao criar cliente");
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
                {...register('nome')}
                placeholder="Nome completo do cliente" 
                aria-invalid={errors.nome ? "true" : "false"}
              />
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome.message}</p>
              )}
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                {...register('email')}
                placeholder="email@exemplo.com" 
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label htmlFor="telefone">Telefone</Label>
              <Input 
                id="telefone"
                {...register('telefone')}
                placeholder="(00) 00000-0000" 
                aria-invalid={errors.telefone ? "true" : "false"}
              />
              {errors.telefone && (
                <p className="text-sm text-red-500">{errors.telefone.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="cidade">Cidade</Label>
                <Input 
                  id="cidade"
                  {...register('cidade')}
                  placeholder="Cidade" 
                  aria-invalid={errors.cidade ? "true" : "false"}
                />
                {errors.cidade && (
                  <p className="text-sm text-red-500">{errors.cidade.message}</p>
                )}
              </div>
              
              <div className="grid w-full gap-1.5">
                <Label htmlFor="estado">Estado</Label>
                <Input 
                  id="estado"
                  {...register('estado')}
                  placeholder="Estado" 
                  aria-invalid={errors.estado ? "true" : "false"}
                />
                {errors.estado && (
                  <p className="text-sm text-red-500">{errors.estado.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : "Criar cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
