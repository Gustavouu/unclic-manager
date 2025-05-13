
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Client } from "@/hooks/useClients";
import { Mail, Phone, MapPin, Calendar, CreditCard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientDetailsProps {
  client: Client;
  onClose: () => void;
}

export function ClientDetails({ client, onClose }: ClientDetailsProps) {
  const formatCurrency = (value: number | undefined) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "-";
    return format(new Date(date), "PPP", { locale: ptBR });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-medium uppercase">
              {client.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-medium">{client.name}</h3>
              <p className="text-sm text-muted-foreground">
                Cliente desde {formatDate(client.created_at)}
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Informações de Contato</h4>
            <div className="space-y-2">
              {client.email && (
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
              )}
              {(client.address || client.city || client.state) && (
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    {client.address && <div>{client.address}</div>}
                    {(client.city || client.state) && (
                      <div>
                        {client.city}
                        {client.city && client.state && ", "}
                        {client.state}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Dados Adicionais</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Data de nascimento</p>
                <p className="text-sm">{client.birth_date ? formatDate(client.birth_date) : "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Gênero</p>
                <p className="text-sm">{client.gender || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Última visita</p>
                <p className="text-sm">{client.last_visit ? formatDate(client.last_visit) : "Nunca"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total gasto</p>
                <p className="text-sm">{formatCurrency(client.total_spent)}</p>
              </div>
            </div>
          </div>
          
          {client.notes && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Observações
              </h4>
              <p className="text-sm whitespace-pre-line">{client.notes}</p>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Fechar</Button>
            <Button>Agendar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
