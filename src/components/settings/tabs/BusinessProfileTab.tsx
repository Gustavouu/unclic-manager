
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Upload, MapPin } from "lucide-react";

export const BusinessProfileTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil do Negócio</CardTitle>
        <CardDescription>
          Informações básicas sobre o seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Gerais</h3>
            
            <div className="space-y-2">
              <Label htmlFor="business-name">Nome do Negócio</Label>
              <Input id="business-name" defaultValue="Salão de Beleza" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-email">Email de Contato</Label>
              <Input id="business-email" type="email" defaultValue="contato@salaodebeleza.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-phone">Telefone</Label>
              <Input id="business-phone" type="tel" defaultValue="(11) 99999-9999" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-address">Endereço</Label>
              <div className="flex items-center gap-2">
                <Input id="business-address" type="text" defaultValue="Rua Exemplo, 123" className="flex-1" />
                <Button variant="outline" size="icon">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Logotipo e Imagens</h3>
            
            <div className="space-y-2">
              <Label htmlFor="business-logo">Logotipo</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Alterar Logotipo
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-cover">Imagem de Capa</Label>
              <div className="flex items-center gap-4">
                <div className="w-48 h-24 rounded-md bg-gray-200 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Alterar Imagem
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Redes Sociais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook-link">Facebook</Label>
              <Input id="facebook-link" type="url" placeholder="https://www.facebook.com/seunegocio" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagram-link">Instagram</Label>
              <Input id="instagram-link" type="url" placeholder="https://www.instagram.com/seunegocio" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin-link">LinkedIn</Label>
              <Input id="linkedin-link" type="url" placeholder="https://www.linkedin.com/company/seunegocio" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter-link">Twitter</Label>
              <Input id="twitter-link" type="url" placeholder="https://twitter.com/seunegocio" />
            </div>
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
