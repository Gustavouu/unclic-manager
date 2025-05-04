
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CreditCard, DollarSign, Banknote, QrCode, PiggyBank, Receipt } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export const FinancialTab = () => {
  const [showEfiPaySetup, setShowEfiPaySetup] = useState(false);
  
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
                  <QrCode className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">PIX</p>
                    <span className="text-sm text-muted-foreground">Taxa: 0.99%</span>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Dinheiro</p>
                    <span className="text-sm text-muted-foreground">Taxa: 0%</span>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações de Comissão</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default-commission-type">Tipo de Comissão Padrão</Label>
                  <Select defaultValue="percentage">
                    <SelectTrigger id="default-commission-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentual</SelectItem>
                      <SelectItem value="fixed">Valor Fixo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="default-commission-value">Valor Padrão</Label>
                  <div className="relative">
                    <Input 
                      id="default-commission-value"
                      type="number" 
                      placeholder="20" 
                      defaultValue="20"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="enable-individual-commission" defaultChecked />
                <Label htmlFor="enable-individual-commission">Permitir comissões individuais por profissional</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="enable-service-commission" defaultChecked />
                <Label htmlFor="enable-service-commission">Permitir comissões específicas por serviço</Label>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Integração com EFIPAY</h3>
            <Switch 
              id="efipay-integration" 
              checked={showEfiPaySetup} 
              onCheckedChange={setShowEfiPaySetup} 
            />
          </div>
          
          {showEfiPaySetup && (
            <div className="border rounded-md p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="efipay-client-id">Client ID</Label>
                  <Input id="efipay-client-id" placeholder="Digite seu Client ID" />
                </div>
                
                <div>
                  <Label htmlFor="efipay-client-secret">Client Secret</Label>
                  <Input id="efipay-client-secret" type="password" placeholder="Digite seu Client Secret" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="efipay-environment">Ambiente</Label>
                <Select defaultValue="sandbox">
                  <SelectTrigger id="efipay-environment">
                    <SelectValue placeholder="Selecione o ambiente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox (Testes)</SelectItem>
                    <SelectItem value="production">Produção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="efipay-auto-capture" defaultChecked />
                <Label htmlFor="efipay-auto-capture">Captura automática</Label>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2">
                <PiggyBank className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Como configurar o EFIPAY?</p>
                  <p className="text-xs text-blue-700">
                    Acesse o portal EFIPAY, crie sua conta e obtenha suas credenciais de API. 
                    Após a configuração, você poderá receber pagamentos online diretamente na sua conta.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Configurações de Impostos</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="default-tax-rate">Taxa de Imposto Padrão</Label>
              <div className="relative">
                <Input 
                  id="default-tax-rate"
                  type="number" 
                  placeholder="0" 
                  defaultValue="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="tax-calculation">Cálculo de Impostos</Label>
              <Select defaultValue="included">
                <SelectTrigger id="tax-calculation">
                  <SelectValue placeholder="Selecione o tipo de cálculo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="included">Incluído no preço</SelectItem>
                  <SelectItem value="excluded">Aplicado sobre o preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="show-tax-details" />
            <Label htmlFor="show-tax-details">Mostrar detalhes de impostos nos recibos</Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Alterações</Button>
      </CardFooter>
    </Card>
  );
};
