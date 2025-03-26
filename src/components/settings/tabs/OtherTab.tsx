
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Database, Shield, FileText, Languages, Palette } from "lucide-react";

export const OtherTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Outras Configurações</CardTitle>
        <CardDescription>
          Configurações gerais e preferências do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preferências Gerais</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Languages className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="language">Idioma</Label>
                  </div>
                </div>
                <Select defaultValue="pt-BR">
                  <SelectTrigger id="language" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (BR)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="theme">Tema da Interface</Label>
                  </div>
                </div>
                <Select defaultValue="system">
                  <SelectTrigger id="theme" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="invoice-prefix">Prefixo de Fatura</Label>
                  </div>
                </div>
                <Input id="invoice-prefix" className="w-40" defaultValue="INV-" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customização</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-logo">Mostrar Logo nas Páginas</Label>
                </div>
                <Switch id="show-logo" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-social">Mostrar Redes Sociais</Label>
                </div>
                <Switch id="show-social" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="custom-colors">Cores Personalizadas</Label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 border border-gray-300"></div>
                  <div className="w-6 h-6 rounded-full bg-green-500 border border-gray-300"></div>
                  <Button variant="outline" size="sm" className="h-6">Editar</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Manutenção</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="data-backup">Backup de Dados</Label>
                    <p className="text-sm text-muted-foreground">Configurar backups automáticos</p>
                  </div>
                </div>
                <Select defaultValue="daily">
                  <SelectTrigger id="data-backup" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="data-retention">Retenção de Dados</Label>
                    <p className="text-sm text-muted-foreground">Tempo de armazenamento de dados</p>
                  </div>
                </div>
                <Select defaultValue="36">
                  <SelectTrigger id="data-retention" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 meses</SelectItem>
                    <SelectItem value="24">24 meses</SelectItem>
                    <SelectItem value="36">36 meses</SelectItem>
                    <SelectItem value="unlimited">Ilimitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline">Exportar Dados</Button>
            <Button variant="outline" className="text-red-500 hover:text-red-700">Limpar Cache</Button>
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
