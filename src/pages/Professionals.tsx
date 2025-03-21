
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserRoundPlus } from "lucide-react";

const Professionals = () => {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-display font-medium">Gerenciamento de Colaboradores</h1>
        <Button className="gap-2">
          <UserRoundPlus size={16} />
          Novo Colaborador
        </Button>
      </div>
      
      <Card className="animated-border">
        <CardContent className="p-6">
          <div className="h-[400px] flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-2">Funcionalidade de colaboradores completa em desenvolvimento</p>
            <p className="text-sm text-muted-foreground/75">Aqui você poderá gerenciar os colaboradores do seu estabelecimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Professionals;
