
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScissorsSquare } from "lucide-react";

const Services = () => {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-display font-medium">Gerenciamento de Serviços</h1>
        <Button className="gap-2">
          <ScissorsSquare size={16} />
          Novo Serviço
        </Button>
      </div>
      
      <Card className="animated-border">
        <CardContent className="p-6">
          <div className="h-[400px] flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-2">Funcionalidade de serviços completa em desenvolvimento</p>
            <p className="text-sm text-muted-foreground/75">Aqui você poderá gerenciar os serviços oferecidos pelo seu estabelecimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;
