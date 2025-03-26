
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cog, UserMinus } from "lucide-react";

export const StaffTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Funcionários</CardTitle>
        <CardDescription>
          Adicione e gerencie os funcionários do seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Funcionários Ativos</h3>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>João da Silva</TableCell>
                  <TableCell>joao@exemplo.com</TableCell>
                  <TableCell>(11) 99999-9999</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Cog className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Maria Santos</TableCell>
                  <TableCell>maria@exemplo.com</TableCell>
                  <TableCell>(11) 99999-9999</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Cog className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Pedro Lima</TableCell>
                  <TableCell>pedro@exemplo.com</TableCell>
                  <TableCell>(11) 99999-9999</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Cog className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Adicionar Novo Funcionário</h3>
            <Button variant="outline" size="sm">
              Convidar Funcionário
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staff-name">Nome Completo</Label>
              <Input id="staff-name" placeholder="Ex: Ana Souza" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staff-email">Email</Label>
              <Input id="staff-email" type="email" placeholder="Ex: ana@exemplo.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staff-phone">Telefone</Label>
              <Input id="staff-phone" type="tel" placeholder="Ex: (11) 99999-9999" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staff-role">Função</Label>
              <Select defaultValue="professional">
                <SelectTrigger id="staff-role">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrator">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="professional">Profissional</SelectItem>
                </SelectContent>
              </Select>
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
