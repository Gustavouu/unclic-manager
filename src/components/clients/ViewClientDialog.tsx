
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Calendar, FileText, DollarSign } from 'lucide-react';
import { useClients } from "@/hooks/useClients";
import type { Client } from "@/types/client";

interface ViewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
}

export const ViewClientDialog: React.FC<ViewClientDialogProps> = ({
  open,
  onOpenChange,
  clientId
}) => {
  const { clients } = useClients();
  
  const client = clientId ? clients.find(c => c.id === clientId) : null;

  if (!client) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cliente não encontrado</DialogTitle>
            <DialogDescription>
              O cliente solicitado não foi encontrado.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return 'N/A';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {client.name}
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas do cliente
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{client.email || 'Não informado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{formatPhone(client.phone)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Data de Nascimento:</span>
                  <p className="text-sm font-medium">{formatDate(client.birth_date)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Gênero:</span>
                  <p className="text-sm font-medium">{client.gender || 'Não informado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          {(client.address || client.city || client.state || client.zip_code) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {client.address && (
                    <p className="text-sm">{client.address}</p>
                  )}
                  <div className="flex gap-2 text-sm">
                    {client.city && <span>{client.city}</span>}
                    {client.state && <span>- {client.state}</span>}
                    {client.zip_code && <span>- CEP: {client.zip_code}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico e Estatísticas */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Gasto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(client.total_spent || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Última Visita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">
                  {formatDate(client.last_visit)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status e Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Observações e Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <Badge variant="secondary">
                  {client.status || 'Ativo'}
                </Badge>
              </div>
              
              {client.notes && (
                <div>
                  <span className="text-sm text-gray-500">Observações:</span>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded border">
                    {client.notes}
                  </p>
                </div>
              )}
              
              <div className="text-xs text-gray-400 pt-2 border-t">
                <p>Cliente desde: {formatDate(client.created_at)}</p>
                <p>Última atualização: {formatDate(client.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
