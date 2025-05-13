
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
import { ClientFormData } from '@/hooks/useClients';
import { formatPhoneNumber } from '@/services/client/clientUtils';

// Schema for client form validation
const clientSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
});

interface NewClientDialogProps {
  onClose: () => void;
  onClientCreated?: (client: any) => void;
}

export const NewClientDialog = ({ onClose, onClientCreated }: NewClientDialogProps) => {
  const { createClient, isSubmitting, error } = useClients(onClientCreated);
  const [authChecked, setAuthChecked] = useState(false);
  const { user } = useAuth();
  const { businessId } = useTenant();
  
  // Set up the form with validation
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
    }
  });
  
  // Check auth status when component mounts
  useEffect(() => {
    setAuthChecked(true);
  }, [user, businessId]);
  
  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedPhone = '';
    
    if (value.length <= 2) {
      formattedPhone = value;
    } else if (value.length <= 6) {
      formattedPhone = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length <= 10) {
      formattedPhone = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else {
      formattedPhone = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }
    
    setValue('phone', formattedPhone);
  };
  
  const onSubmit = async (data: ClientFormData) => {
    try {
      console.log("Submitting client data:", data);
      
      const newClient = await createClient(data);
      
      if (newClient) {
        onClose();
      }
    } catch (error: any) {
      console.error("Error in client creation:", error);
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
              <Label htmlFor="name">Nome completo *</Label>
              <Input 
                id="name" 
                {...register('name')}
                placeholder="Nome completo do cliente" 
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
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
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone"
                {...register('phone')}
                placeholder="(00) 00000-0000" 
                className={errors.phone ? "border-red-500" : ""}
                onChange={handlePhoneChange}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="city">Cidade</Label>
                <Input 
                  id="city"
                  {...register('city')}
                  placeholder="Cidade" 
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>
              
              <div className="grid w-full gap-1.5">
                <Label htmlFor="state">Estado</Label>
                <Input 
                  id="state"
                  {...register('state')}
                  placeholder="Estado" 
                  className={errors.state ? "border-red-500" : ""}
                />
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !businessId || !user}
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
