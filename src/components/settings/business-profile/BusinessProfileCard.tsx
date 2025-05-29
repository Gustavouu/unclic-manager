
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/contexts/TenantContext";
import { Building, Mail, Phone, MapPin } from "lucide-react";

export function BusinessProfileCard() {
  const { businessName, businessId } = useTenant();

  // Mock business data for now
  const businessData = {
    name: businessName || "Meu Negócio",
    email: "contato@meunegocio.com",
    phone: "(11) 99999-9999",
    address: "Rua Principal, 123 - Centro",
    city: "São Paulo",
    state: "SP",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Perfil do Negócio
        </CardTitle>
        <CardDescription>
          Informações básicas sobre seu estabelecimento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Negócio</label>
            <p className="text-sm text-muted-foreground">{businessData.name}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <p className="text-sm text-muted-foreground">{businessData.email}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Phone className="h-4 w-4" />
              Telefone
            </label>
            <p className="text-sm text-muted-foreground">{businessData.phone}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Endereço
            </label>
            <p className="text-sm text-muted-foreground">
              {businessData.address}, {businessData.city} - {businessData.state}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button variant="outline">
            Editar Informações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
