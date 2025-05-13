
import React, { useState, useEffect } from 'react';
import { useServices } from '@/hooks/useServices';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, AlertCircle, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTenant } from '@/contexts/TenantContext';
import BusinessSetupAlert from '@/components/dashboard/BusinessSetupAlert';
import { formatCurrency } from '@/lib/format';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const serviceSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  preco: z.coerce.number().min(0, "Preço deve ser maior ou igual a zero"),
  duracao: z.coerce.number().min(1, "Duração deve ser pelo menos 1 minuto"),
  descricao: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export function ServicesTab() {
  const { services, isLoading, error, refreshServices, addService, updateService, deleteService } = useServices();
  const { businessId, businessNeedsSetup } = useTenant();
  
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [deletingService, setDeletingService] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      nome: '',
      preco: 0,
      duracao: 30,
      descricao: '',
    }
  });

  useEffect(() => {
    if (editingService) {
      form.reset({
        nome: editingService.nome,
        preco: editingService.preco,
        duracao: editingService.duracao,
        descricao: editingService.descricao || '',
      });
    } else {
      form.reset({
        nome: '',
        preco: 0,
        duracao: 30,
        descricao: '',
      });
    }
  }, [editingService, form]);

  const handleAddService = () => {
    setEditingService(null);
    setShowAddService(true);
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setShowAddService(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;
    
    try {
      await deleteService(deletingService);
      toast.success("Serviço removido com sucesso");
      setDeletingService(null);
    } catch (error: any) {
      toast.error(`Erro ao remover serviço: ${error.message}`);
    }
  };

  const handleFormSubmit = async (data: ServiceFormValues) => {
    if (!businessId) {
      toast.error("ID do negócio não disponível");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingService) {
        await updateService(editingService.id, data);
        toast.success("Serviço atualizado com sucesso");
      } else {
        await addService(data);
        toast.success("Serviço adicionado com sucesso");
      }
      setShowAddService(false);
    } catch (error: any) {
      toast.error(`Erro ao salvar serviço: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (businessNeedsSetup) {
    return <BusinessSetupAlert />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando serviços...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <div className="mt-2">
            <Button onClick={refreshServices} variant="outline" size="sm">
              Tentar novamente
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Serviços</h3>
        <Button onClick={handleAddService}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Serviço
        </Button>
      </div>

      {services?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <p className="text-muted-foreground">Nenhum serviço cadastrado.</p>
              <Button onClick={handleAddService} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Adicionar seu primeiro serviço
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services?.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{service.nome}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Preço:</span>
                    <span>{formatCurrency(service.preco)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Duração:</span>
                    <span>{service.duracao} minutos</span>
                  </div>
                  {service.descricao && (
                    <div className="pt-2">
                      <span className="text-sm font-medium">Descrição:</span>
                      <p className="text-sm text-muted-foreground">{service.descricao}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditService(service)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setDeletingService(service.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remover
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Service Dialog */}
      <Dialog open={showAddService} onOpenChange={setShowAddService}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Editar Serviço" : "Adicionar Serviço"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do serviço</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Corte de Cabelo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          step="0.01" 
                          min="0" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duracao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (minutos)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="30" 
                          min="1" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o serviço..." 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddService(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>Salvar</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingService} onOpenChange={() => setDeletingService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingService(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
