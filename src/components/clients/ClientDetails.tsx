
import { useClientHistory } from "@/hooks/useClientHistory";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientInfoTab } from "./details/ClientInfoTab";
import { ServiceHistoryTab } from "./details/ServiceHistoryTab";
import { PurchaseHistoryTab } from "./details/PurchaseHistoryTab";
import { Button } from "../ui/button";
import { Calendar, Edit, Phone } from "lucide-react";
import { Link } from "react-router-dom";

type ClientDetailsProps = {
  clientId: string;
  onClose: () => void;
};

export const ClientDetails = ({ clientId, onClose }: ClientDetailsProps) => {
  const { client, serviceHistory, purchaseHistory, isLoading } = useClientHistory(clientId);

  if (isLoading) {
    return (
      <Sheet open onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Carregando...</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  if (!client) {
    return (
      <Sheet open onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Cliente não encontrado</SheetTitle>
            <SheetDescription>
              O cliente requisitado não existe ou foi removido.
            </SheetDescription>
          </SheetHeader>
          <SheetClose asChild>
            <Button className="mt-4">Fechar</Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="flex flex-col mb-6">
          <SheetTitle className="text-2xl mb-1">{client.name}</SheetTitle>
          <SheetDescription className="text-sm flex items-center gap-1">
            <span className={`inline-block w-2 h-2 rounded-full ${client.lastVisit ? 'bg-green-500' : 'bg-amber-500'}`}></span>
            <span>{client.category || 'Regular'}</span>
            {client.lastVisit ? (
              <span className="text-gray-500">
                • Última visita: {new Date(client.lastVisit).toLocaleDateString('pt-BR')}
              </span>
            ) : (
              <span className="text-gray-500">• Novo cliente</span>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button size="sm" variant="outline" asChild>
            <Link to={`/appointments?clientId=${client.id}`}>
              <Calendar className="mr-2 h-4 w-4" />
              Agendar
            </Link>
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button size="sm" variant="outline">
            <Phone className="mr-2 h-4 w-4" />
            Contatar
          </Button>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="purchases">Compras</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <ClientInfoTab client={client} />
          </TabsContent>
          <TabsContent value="services">
            <ServiceHistoryTab serviceHistory={serviceHistory} />
          </TabsContent>
          <TabsContent value="purchases">
            <PurchaseHistoryTab purchaseHistory={purchaseHistory} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
