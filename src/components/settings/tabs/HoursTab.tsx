
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const HoursTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horários de Funcionamento</CardTitle>
        <CardDescription>
          Defina os horários de funcionamento do seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Horários Regulares</h3>
            
            <div className="space-y-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dia da Semana</TableHead>
                    <TableHead>Horário de Abertura</TableHead>
                    <TableHead>Horário de Fechamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Segunda-feira</TableCell>
                    <TableCell>08:00</TableCell>
                    <TableCell>18:00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Terça-feira</TableCell>
                    <TableCell>08:00</TableCell>
                    <TableCell>18:00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Quarta-feira</TableCell>
                    <TableCell>08:00</TableCell>
                    <TableCell>18:00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Quinta-feira</TableCell>
                    <TableCell>08:00</TableCell>
                    <TableCell>18:00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sexta-feira</TableCell>
                    <TableCell>08:00</TableCell>
                    <TableCell>18:00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sábado</TableCell>
                    <TableCell>09:00</TableCell>
                    <TableCell>13:00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Domingo</TableCell>
                    <TableCell>Fechado</TableCell>
                    <TableCell>Fechado</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Horários Especiais</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="holiday-hours">Horários de Feriados</Label>
                <Button variant="outline" size="sm">
                  Adicionar Feriado
                </Button>
              </div>
              
              <div className="border rounded-md p-3">
                <p className="text-sm text-muted-foreground">
                  Nenhum horário especial definido.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="temporary-hours">Horários Temporários</Label>
                <Button variant="outline" size="sm">
                  Adicionar Horário
                </Button>
              </div>
              
              <div className="border rounded-md p-3">
                <p className="text-sm text-muted-foreground">
                  Nenhum horário temporário definido.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Ajustes Adicionais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="break-time">Tempo de Intervalo</Label>
              <Select defaultValue="0">
                <SelectTrigger id="break-time">
                  <SelectValue placeholder="Selecione o tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sem Intervalo</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buffer-time">Tempo de Preparação</Label>
              <Select defaultValue="0">
                <SelectTrigger id="buffer-time">
                  <SelectValue placeholder="Selecione o tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sem Preparação</SelectItem>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="10">10 minutos</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
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
