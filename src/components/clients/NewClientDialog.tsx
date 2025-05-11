
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
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/contexts/TenantContext';
import { supabase } from '@/integrations/supabase/client';

const clientSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { businessId } = useTenant();
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setAuthStatus(data.session ? 'authenticated' : 'unauthenticated');
      console.log('Auth status:', data.session ? 'authenticated' : 'unauthenticated');
      console.log('User:', user);
      console.log('Business ID:', businessId);
    };
    
    checkAuth();
  }, [user, businessId]);
  
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
      console.log("Auth status:", authStatus);
      console.log("Business ID:", businessId);
      
      // Pass both tenant_id and id_negocio for compatibility
      const clientData = {
        ...data,
        tenant_id: businessId, // Add tenant_id (new standard field)
      };
      
      const newClient = await createClient(clientData);
      
      if (newClient && onClientCreated) {
        onClientCreated(newClient);
        toast.success("Cliente criado com sucesso!");
      }
      
      onClose();
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast.error(`Erro ao criar cliente: ${error.message}`);
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
        
        {!businessId && (
          <div className="bg-yellow-100 p-3 rounded-md mb-4">
            <p className="text-yellow-800">Aviso: ID do negócio não disponível. Você precisa estar vinculado a um negócio.</p>
          </div>
        )}
        
        {!user && (
          <div className="bg-red-100 p-3 rounded-md mb-4">
            <p className="text-red-800">Aviso: Você precisa estar autenticado para criar clientes.</p>
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
                />
                {errors.estado && (
                  <p className="text-sm text-red-500">{errors.estado.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || !businessId || !user}>
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
