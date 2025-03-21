
import { Client } from "@/hooks/useClientData";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Calendar, CreditCard, User } from "lucide-react";

type ClientInfoTabProps = {
  client: Client;
};

export const ClientInfoTab = ({ client }: ClientInfoTabProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-gray-500">Informações de Contato</h3>
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-gray-700">{client.email || "Não informado"}</div>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Telefone</div>
                  <div className="text-sm text-gray-700">{client.phone || "Não informado"}</div>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Cidade</div>
                  <div className="text-sm text-gray-700">{client.city || "Não informada"}</div>
                </div>
              </div>
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Gênero</div>
                  <div className="text-sm text-gray-700">{client.gender || "Não informado"}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-sm font-medium text-gray-500">Dados de Consumo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <div className="text-sm font-medium">Última Visita</div>
                <div className="text-sm text-gray-700">
                  {client.lastVisit 
                    ? new Date(client.lastVisit).toLocaleDateString('pt-BR') 
                    : "Nunca visitou"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <div className="text-sm font-medium">Total Gasto</div>
                <div className="text-sm text-gray-700">
                  {formatCurrency(client.totalSpent)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
