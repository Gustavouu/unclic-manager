
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CreditCard, DollarSign } from "lucide-react";

export const FinancialTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Financeiras</CardTitle>
        <CardDescription>
          Defina as configurações financeiras do seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Formas de Pagamento</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Cartão de Crédito</p>
                    <span className="text-sm text-muted-foreground">Taxa: 2.99%</span>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Cartão de Débito</p>
                    <span className="text-sm text-muted-foreground">Taxa: 1.99%</span>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Dinheiro</p>
                    <span className="text-sm text-muted-foreground">Taxa: 0%</span>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Alterações</Button>
      </CardFooter>
    </Card>
  );
};
