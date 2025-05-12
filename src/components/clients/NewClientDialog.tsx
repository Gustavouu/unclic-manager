
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useClients } from "@/hooks/useClients";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/hooks/useAuth';
import { ClientFormData } from '@/types/client';
import { clientSchema, formatPhoneNumberInput } from '@/utils/validation';

interface NewClientDialogProps {
  onClose: () => void;
  onClientCreated?: (client: any) => void;
}

export const NewClientDialog = ({ onClose, onClientCreated }: NewClientDialogProps) => {
  const { createClient, isSubmitting, error } = useClients(onClientCreated);
  const [authChecked, setAuthChecked] = useState(false);
  const { user } = useAuth();
  const { businessId, tenantId } = useTenant();
  
  // Set up the form with validation
  const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      cidade: '',
      estado: '',
    }
  });
  
  // Check auth status when component mounts
  useEffect(() => {
    setAuthChecked(true);
  }, [user, businessId]);
  
  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumberInput(e.target.value);
    setValue('telefone', formattedPhone);
  };
  
  const onSubmit = async (data: ClientFormData) => {
    try {
      // Make sure there's a tenant ID (business ID)
      if (!businessId && !tenantId) {
        setError('nome', { 
          type: 'manual', 
          message: 'ID do negócio não disponível. Entre em contato com o suporte.' 
        });
        return;
      }
      
      console.log("Submitting client data:", data);
      
      // Create the client using whichever ID is available (prefer tenant_id)
      const newClient = await createClient(data);
      
      if (newClient) {
        toast.success("Cliente criado com sucesso!");
        onClose();
      }
    } catch (error: any) {
      console.error("Error in client creation:", error);
      toast.error("Erro ao criar cliente", {
        description: error.message || "Ocorreu um erro ao criar o cliente"
      });
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>
        
        {!businessId && !tenantId && (
          <div className="bg-yellow-100 p-3 rounded-md mb-4">
            <p className="text-yellow-800">Aviso: ID do negócio não disponível. Você precisa estar vinculado a um negócio.</p>
          </div>
        )}
        
        {!user && authChecked && (
          <div className="bg-red-100 p-3 rounded-md mb-4">
            <p className="text-red-800">Aviso: Você precisa estar autenticado para criar clientes.</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 p-3 rounded-md mb-4">
            <p className="text-red-800">Erro: {error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input 
                id="nome" 
                {...register('nome')}
                placeholder="Nome completo do cliente" 
                className={errors.nome ? "border-red-500" : ""}
                autoFocus
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
                className={errors.email ? "border-red-500" : ""}
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
                className={errors.telefone ? "border-red-500" : ""}
                onChange={handlePhoneChange}
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
                  className={errors.cidade ? "border-red-500" : ""}
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
                  className={errors.estado ? "border-red-500" : ""}
                />
                {errors.estado && (
                  <p className="text-sm text-red-500">{errors.estado.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || (!businessId && !tenantId) || !user}
              className="relative"
            >
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
