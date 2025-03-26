
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KeyRound, UserCheck, Users2, UserPlus } from "lucide-react";

export const PermissionsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões</CardTitle>
        <CardDescription>
          Gerencie permissões e acessos de usuários
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Funções de Usuário</h3>
            
            <div className="space-y-2">
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Função</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Administrador</TableCell>
                      <TableCell>Acesso completo ao sistema</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Gerente</TableCell>
                      <TableCell>Gerencia funcionários e agendamentos</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Profissional</TableCell>
                      <TableCell>Acesso ao próprio agenda e clientes</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Recepcionista</TableCell>
                      <TableCell>Gerencia agendamentos e clientes</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="mt-2">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nova Função
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Políticas de Segurança</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <KeyRound className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="two-factor">Autenticação em Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Exigir para todos os usuários</p>
                  </div>
                </div>
                <Switch id="two-factor" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="session-timeout">Tempo Limite de Sessão</Label>
                    <p className="text-sm text-muted-foreground">Desconectar usuários inativos</p>
                  </div>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger id="session-timeout" className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users2 className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="user-invite">Convites de Usuário</Label>
                    <p className="text-sm text-muted-foreground">Permitir que gerentes convidem novos usuários</p>
                  </div>
                </div>
                <Switch id="user-invite" defaultChecked />
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Acesso a Recursos</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-data-access">Acesso a Dados de Clientes</Label>
              <Select defaultValue="restricted">
                <SelectTrigger id="client-data-access">
                  <SelectValue placeholder="Selecione a política" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restricted">Restrito por Função</SelectItem>
                  <SelectItem value="professional">Apenas para Profissionais Atendentes</SelectItem>
                  <SelectItem value="managers">Gerentes e Administradores</SelectItem>
                  <SelectItem value="all">Todos os Funcionários</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="financial-access">Acesso a Dados Financeiros</Label>
              <Select defaultValue="managers">
                <SelectTrigger id="financial-access">
                  <SelectValue placeholder="Selecione a política" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Apenas Administradores</SelectItem>
                  <SelectItem value="managers">Gerentes e Administradores</SelectItem>
                  <SelectItem value="summary">Resumo para Profissionais</SelectItem>
                  <SelectItem value="all">Todos os Funcionários</SelectItem>
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
